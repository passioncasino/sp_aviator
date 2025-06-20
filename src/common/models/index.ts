import { MongoClient } from 'mongodb';
let Users : any;

export const connect = async (dbName : string) => {
    try {
        const mongoURL = process.env.CONNECTION_STRING as string;
        const client = new MongoClient( mongoURL );
        await client.connect();
        console.log(`Connected to ${ dbName }` );
        const db = client.db(dbName);
        Users = db.collection('Users');

        return true;
    } catch ( error ) {
        console.log(`db connect error, `, error);
    }
};

/**
 * user management
 */

const initUserInfo = ( userInfo:any ) => {
    return userInfo;
}

const createUserInfo = async ( userInfo:any, oldUser:any, state: number ) => {
    try {
        /**
         * state=0 same user is not existing
         * state=1 user and game exist
         * state=2 same user but no game
         */
        let oldFrStatus: any = {};
        let oldGameStatus: any = {};
        if( state>0 ) {
            if( userInfo.property.mode===0 ) userInfo.balance = oldUser.balance;
            if( state===1 ) {
                oldGameStatus = oldUser.gameStatus;
                oldFrStatus = oldUser.frStatus;
                const isDelete = await Users.deleteOne({ 
                    token:oldUser.token
                });
            }
        }
        userInfo = initUserInfo( userInfo );
        if( state===1 ) {
            userInfo.gameStatus = oldGameStatus
            userInfo.frStatus = oldFrStatus
        }
        const res = await Users.insertOne( userInfo );
        if( res.insertedId ) return 1;
        else return 0;
    } catch ( err ) {
        console.log("====> createUserInfo ::", err );
        return 501;
    }
}

export const addUser = async ( newUser:any ) => {
    try {
        let addVal = 0;
        let status = 0;
        const oldUserArr = await Users.find({ 
            "property.user": newUser.property.user
        }).toArray();
        let oldUser = oldUserArr[0];
        console.log(`> -------------- > oldUserLen=${oldUserArr.length}`);

        if( oldUserArr.length>0 ) {
            const sameGame = oldUserArr.findIndex( (item:any) => item.property.game===newUser.property.game );
            console.log(`sameGame=${sameGame}`);
            if( sameGame>-1 ) {
                status = 1;
                oldUser = oldUserArr[sameGame];
            } else {
                status = 2;
            }
        }
       
        console.log(`status=${status}`);
        addVal = await createUserInfo( newUser, oldUser, status );
        return addVal;
    } catch (error) {
        console.log('addUser', error);
        return "_SERVERERROR";
    }
}

export const getUserInfo = async( token:string, gameCode:string ) => {
    try {
        return await Users.findOne({
            token : token, 
            "property.game":gameCode 
        }, { 
            sort : {_id : -1}
        });
    } catch (error) {
        console.log('getUserInfo', error);
        return false;
    }
}

export const getUserInfoByUser = async( gameCode: string, user: string ) => {
    try {
        const userInfo = await Users.findOne({
            "property.user": user,
            "property.game": gameCode,
        }, {
            sort: {_id: -1}
        });
        return userInfo;
    } catch (error) {
        console.log(`getUserInfoByUser ::`, error);
    }
}

export const getUserBalance = async( token:string ) => {
    try {
        const user = await Users.findOne( { token:token }, { sort:{_id:-1 }} );
        if( user===null ) return -100;
        else return user.balance;
    } catch (error) {
        console.log('getUserInfo', error);
        return -100;
    }
}

export const updateUserBalance = async( user : string, newBalance : number ) => {
    try {
        const filter = { "property.user":user };
        const updateInfo = { 
            $set : { balance : newBalance }
         };
        await Users.updateMany( filter, updateInfo );
    } catch (error) {
        console.log('updateUserBalance', error);
        return "501";
    }
}

export const updateUserInfo = async( params:any ) => {
    try {
        if( params.isInit ) {
            const userInfo = initUserInfo( params.userInfo );
            await Users.updateOne(
                {
                    token : params.mgckey,
                    "property.game" : params.gameCode
                }, {
                    $set: { 
                        gameStatus: userInfo.gameStatus
                    } 
                }
            )
        } else {

        }
    } catch (error) {
        console.log('updateUserInfo', error);
        return 501;
    }
}