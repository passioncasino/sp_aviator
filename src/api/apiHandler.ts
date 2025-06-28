import * as Models from '@/api/models/index';
import { generateToken } from '@/api/utill/functions';
import { ILauncherParams, IUserInfo } from '@/api/utill/interface';

export const apiHandler = {
    provideLauncher:async( launcher: ILauncherParams ) => {
        const userInfo: IUserInfo = {
            game : launcher.game,
            lang : launcher.lang,
            token: generateToken( launcher.username ),
            balance: 10000,
            // userId : `${launcher.username}&&${launcher.operator}`,
            username : launcher.username,
            currency : launcher.currency,
            operator : launcher.operator
        };

        const userVal = await Models.insertUser( userInfo );
        if( userVal===1 ) {
            const url = 
                `${process.env.OPERATOR_HOST}/aviator?` +
                `user=${ launcher.username }` +
                `&token=${ userInfo.token }` +
                `&lang=${ launcher.lang }` +
                `&currency=${ launcher.currency }` +
                `&operator=${ launcher.operator }` +
                `&return_url=${ launcher.return_url }`;

            const response = {
                error : 200,
                description : "OK",
                result : {
                    url : url
                }
            }
            return response ;
        } else if( userVal===0 ) {
            const response = {
                error : 1,
                description : "Insert New User Failed."
            }
            return response;
        } else {
            const response = {
                error : userVal,
                description : "Internal Error."
            }
            return response;
        }
    },
}