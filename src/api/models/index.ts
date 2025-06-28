import { MongoClient } from 'mongodb';
import { env } from '@/common/utils/envConfig';
import { IUserInfo } from '../utill/interface';

const mongoURL = env.CONNECTION_STRING as string;
const client = new MongoClient( mongoURL );
const db = client.db(env.DBNAME);

const DUsers = db.collection<SchemeUser>('users');
const DGames = db.collection<SchemePlyer>('games');
const DPlayers = db.collection<SchemePlyer>('players'); // players in current game round
const DHistories = db.collection<SchemeUser>('histories');

export const connect = async () => {
    try {
        await client.connect();
        await DUsers.createIndex({ name: 1 }, { unique: true, name: 'users-name' });
        await DGames.createIndex({ name: 1 }, { unique: true, name: 'users-name' });
        await DPlayers.createIndex({ userId: 1 }, { unique: false, name: 'logs-userid' });
        await DHistories.createIndex({ userId: 1 }, { unique: false, name: 'logs-userid' });
        
        console.log(`Connected to ${ env.DBNAME }` );
        return true;
    } catch ( error ) {
        console.log(`db connect error, `, error);
        return false;
    }
};

/**
 * user management
 */
export const getUserInfo = async(  ) => {
    
}

export const insertUser = async( user: IUserInfo ) => {
    try {
        const userInfo = {
            balance: user.balance,
            property: {
                game: user.game,
                // userId: user.userId,
                username: user.username,
                profileImage: "av-61.png",
                operator: user.operator
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

