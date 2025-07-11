import { MongoClient } from 'mongodb';
import { env } from '@/common/utils/envConfig';
import { IUserInfo, IUPlayer } from '../utill/interface';
import initData from "./seed";

const mongoURL = env.CONNECTION_STRING as string;
const client = new MongoClient( mongoURL );
const db = client.db(env.DBNAME);

const DUsers = db.collection<SchemeUser>('users');
const DGames = db.collection<SchemeGame>('games');
const DPlayers = db.collection<SchemePlayer>('players'); // players in current game round
const DHistories = db.collection<SchemeHistory>('histories');

export const connect = async () => {
    try {
        await client.connect();
        const numOfGames = await DGames.countDocuments();
        const numOfHistories = await DHistories.countDocuments();
        console.log(`Connected to ${ env.DBNAME }, numOfGames=${numOfGames}, numOfHistories=${numOfHistories}`);
        if( numOfGames===0 ) await DGames.insertMany( initData.games );
        if( numOfHistories===0 ) await DHistories.insertMany( initData.histories );      
        return true;
    } catch ( error ) {
        console.log(`db connect error, `, error);
        return false;
    }
};

/**
 * User Management
 */
export const insertUser = async( user: IUserInfo ) => {
    try {
        const userInfo = {
            balance: user.balance,
            property: {
                game: user.game,
                // userId: user.userId,
                username: user.username,
                profileImage: "av-61.png",
                operator: user.operator,
                session: user.session,
                currency: user.currency,
                socketId: ""
            },
            gameStatus: {
                isInit: false,
                lastRound: 1,
                stake: 0,
                f: {
                    betAmount: 0,
                    betId: 1,
                    freeBet: false,
                    autoCashOut: 1,
                },
                s: {
                    betAmount: 0,
                    betId: 2,
                    freeBet: false,
                    autoCashOut: 1,
                }
            },
            // settings: {
            //     music: true,
            //     sound: true,
            //     secondBet: true,
            //     animation: true
            // }
        }
        const addUser = await DUsers.insertOne( userInfo );
        console.log(`addUser =`, addUser);
        if( addUser.acknowledged ) return 1
        else return 0;
    } catch (error) {
        console.log(`insertUser error is `, error);
        return 501;
    }
}

export const getUserInfo = async( socketId: string, flag: string ) => {
    try {
        const filter = flag==="socket" ? { "property.socketId": socketId } : { "property.username": socketId };
        const user = await DUsers.findOne( filter );
        if( user===null ) return 3001;
        return user;
    } catch (error) {
        console.log(`getUserInfo error is `, error);
        return 500;
    }
}

export const updateBalance = async( socketId: string, uBalance: number ) => {
    try {
        const filter = {"property.socketId": socketId };
        const updateInfo = { 
            $set : { balance : uBalance }
        };
        const res = await DUsers.updateMany( filter, updateInfo );
        return (res.modifiedCount>0 && res.matchedCount===1) ? 1 : 0;
    } catch (error) {
        console.log(`updateBalance error is `, error);
        return 501;
    }
}

export const updateUserProfile = async( socketId: string, profile: string ) => {
    try {
        const isUser = await DUsers.updateOne({
            "property.socketId": socketId
        }, {
            $set: {
                "property.profileImage": profile
            }
        });
        return isUser.acknowledged && isUser.upsertedCount>0 ? isUser : 0;
    } catch (error) {
        console.log(`updateUserProfile error is `, error);
        return 501;
    }
}

export const updateUserProperty = async( username: string, socketId: string, sessionToken: string ) => {
    try {
        const user = await DUsers.updateOne({
            "property.username": username
        }, {
            $set: {
                "property.socketId": socketId
            }
        });
        return 1;
    } catch (error) {
        console.log(`updateUserProperty error is `, error);
        return 501;
    }
}

export const updateUserGameStatus = async( username: string, uGameStatus:any ) => {
    try {
        const user = await DUsers.updateOne({
            "property.username": username
        }, {
            $set: {
                gameStatus: uGameStatus
            }
        });
        return user.acknowledged && user.upsertedCount>0 ? user : 0;
    } catch (error) {
        console.log(`updateUserGameStatus error is `, error);
        return 501;
    }
}

/**
 * Players Management
 */
export const insertPlayer = async( sPlayer: SchemePlayer ) => {
    try {
        const history = { ...sPlayer, ...{ maxMultiplier: 1 } };
        const addPlayer = await DPlayers.insertOne( sPlayer );
        const addHistory = await DHistories.insertOne( history );

        return addPlayer.acknowledged ? 1 : 0;
    } catch (error) {
        console.log(`insertPlayer error is `, error);
        return 501;
    }
}

export const getPlayerList = async( type: number ) => {
    try {
        if( type===0 ) {
            const players = await DPlayers.find().sort({ created: -1 }).toArray();
            return players;
        } else {
            const seeds: string[] = [];
            const players = await DPlayers.find().sort({ created: -1 }).limit(3).toArray();
            players.forEach((player) => {
                seeds.push( player.clientSeed );
            })
            return seeds;
        }
    } catch (error) {
        console.log(`getPlayerList error is `, error);
        return 501;
    }
}

export const updatePlayer = async( param: IUPlayer ) => {
    try {
        const isUpdate = await DPlayers.updateOne(
            {
                username: param.username
            }, {
                $set: {
                    winAmount: param.cashout,
                    multiplier: param.multiplier
                }
            }
        );
        const isHUpdate = await DHistories.updateMany(
            {
                username: param.username,
                roundId: param.roundId
            },{
                $set: {
                    winAmount: param.cashout,
                    multiplier: param.multiplier
                }
            }
        )
        return isUpdate.acknowledged && isUpdate.modifiedCount>0 ? 1 : 0;
    } catch (error) {
        console.log(`updatePlayer error is `, error);
        return 501;
    }
}

export const deletePlayer = async( username: string, betId: number ) => {
    try {
        const delRes = await DPlayers.deleteOne({
            username: username
        });
        return delRes.acknowledged && delRes.deletedCount>0 ? delRes.deletedCount : 0;
    } catch (error) {
        console.log(`deletePlayer error is `, error);
        return 501;
    }
}

/**
 * History Management
 */
export const getUserBetHistory = async( username: string ) => {
    try {
        const history = await DHistories.find({ username: username }).sort({ roundBetId: -1 }).toArray();
        return history;
    } catch (error) {
        console.log(`deletePlayer error is `, error);
        return 501;
    }
}

export const getHugeWinInfo = async() => {
    try {
        const filter = { multiplier: { $gt: 0 }};
        const sorting: {[ key: string ]: 1 | -1 } = { winAmount: -1 };
        const hugeWins = await DHistories.find( filter ).sort( sorting ).limit( 20 ).toArray();
        return hugeWins;
    } catch (error) {
        console.log(`getHugeWinInfo error is `, error);
        return 501;
    }
}

export const updatePlayersAfterCrash = async( roundId: number, maxMultiplier: number ) => {
    try {
        const isUpdate = await DHistories.updateMany(
            {
                roundId: roundId
            }, {
                $set: {
                    maxMultiplier: maxMultiplier
                }
            }
        )
        const isDelete = await DPlayers.deleteMany({});

        return isUpdate;
    } catch (error) {
        console.log(`updatePlayersAfterCrash error is `, error);
        return 501;
    }
}

/**
 * Game History
 */

export const insertPreviousGame = async( game: SchemeGame ) => {
    try {
        const addGame = await DGames.insertOne( game );
        return addGame.acknowledged ? 1 : 0;
    } catch (error) {
        console.log(`insertPreviousGame error is `, error);
        return 501;
    }
}

export const getTopRounds = async() => {
    try {
        const arrange: { [key: string]: 1 | -1 } = { maxMultiplier: -1 };
        const topRounds = await DGames.find({}).sort(arrange).limit( 20 ).toArray();
        return topRounds;
    } catch (error) {
        console.log(`deletePlayer error is `, error);
        return 501;
    }
}

export const getPastGamesInfo = async( type: number ) => { // 0: topWin, 1: created
    try {
        const arrange: { [key: string]: 1 | -1 } = type===0 ? { winAmount: -1 } : { roundStartDate: -1 } ;
        const pastGames = await DHistories.find({}).sort( arrange ).limit( 20 ).toArray();
        // console.log(` ==> pastGames =`, pastGames);
        return pastGames;
    } catch (error) {
        console.log(`getPastGamesInfo error is `, error);
        return 501;
    }
}

export const getPrevGameInfo = async( prevId: number, flag: number ) => {
    try {
        const prevGame = await DGames.findOne({ roundId: prevId });
        let prevBets: SchemeHistory[] = [];
        if( prevGame===null ) return 1;
        if( flag===0 ) prevBets = await DHistories.find({ roundId: prevId }).sort({ _id: -1 }).toArray();
        return { prevGame, prevBets };
    } catch (error) {
        console.log(`getPrevGameInfo error is `, error);
        return 501;
    }
}
