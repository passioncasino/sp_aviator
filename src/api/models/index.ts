import { MongoClient } from 'mongodb';
import { env } from '@/common/utils/envConfig';
import { IUserInfo } from '../utill/interface';

const mongoURL = env.CONNECTION_STRING as string;
const client = new MongoClient( mongoURL );
const db = client.db(env.DBNAME);

const DUsers = db.collection<SchemeUser>('users');
const DGames = db.collection<SchemeGame>('games');
const DPlayers = db.collection<SchemePlayer>('players'); // players in current game round
const DHistories = db.collection<SchemeHistory>('histories');

const connect = async () => {
    try {
        await client.connect();
        // await DUsers.createIndex({ name: 1 }, { unique: true, name: 'users-name' });
        // await DGames.createIndex({ name: 1 }, { unique: true, name: 'users-name' });
        // await DPlayers.createIndex({ userId: 1 }, { unique: false, name: 'logs-userid' });
        // await DHistories.createIndex({ userId: 1 }, { unique: false, name: 'logs-userid' });
        
        console.log(`Connected to ${ env.DBNAME }` );
        return true;
    } catch ( error ) {
        console.log(`db connect error, `, error);
        return false;
    }
};

/**
 * User Management
 */
const insertUser = async( user: IUserInfo ) => {
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
            },
            gameStatus: {
                isInit: false,
                betAmount: 1,
                betId: 1,
                freeBet: false,
            },
            settings: {
                music: true,
                sound: true,
                secondBet: true,
                animation: true
            }
        }
        const addUser = await DUsers.insertOne( userInfo );
        console.log(`addUser =`, addUser);
        if( addUser.acknowledged ) return 1
        else return 0;
    } catch (error) {
        return 501;
    }
}

const getUserInfo = async( username: string ) => {
    try {
        const user = await DUsers.findOne({ "property.username": username });
        if( user===null ) return 3001;
        return user;
    } catch (error) {
        return 500;
    }
}

const updateUserInfo = async( username: string, uGameStatus:any ) => {
    try {
        const user = await DUsers.updateOne(
            {
                "property.username": username
            }, {
                $set: {
                    gameStatus: uGameStatus
                }
            }
        );
        return user;
    } catch (error) {
        return 501;
    }
}

/**
 * 
 * Players Management
 */
const insertPlayer = async( sPlayer: SchemePlayer ) => {
    try {
        const addPlayer = await DPlayers.insertOne( sPlayer );
        if( addPlayer.acknowledged ) return 1;
        else return 0;
    } catch (error) {
        return 501;
    }
}

const deletePlayer = async() => {
    try {
        
    } catch (error) {
        return 501;
    }
}

const getTopRounds = async() => {
    try {
        const topRounds = await DGames.find().sort({ multi: -1 }).limit(20).toArray();
        return topRounds;
    } catch (error) {
        return 500;
    }
}

export default {
    connect,
    insertUser,
    getUserInfo,
    updateUserInfo,
    insertPlayer
}