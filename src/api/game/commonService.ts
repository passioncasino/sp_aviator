import * as Models from '@/common/models/index';
import { generateToken } from '@/api/utill/functions';
import { ILauncherParams } from '@/api/utill/interface';

export const commonService = {
    provideLauncher:async( launcher: ILauncherParams ) => {
        const userInfo : any = {};
        userInfo.token = generateToken( launcher.user );
        userInfo.balance = 10000;
        userInfo.property = {
            game : launcher.game,
            lang : launcher.lang,
            user : launcher.user,
            currency : launcher.currency,
        };

        const userVal = await Models.addUser(userInfo);
        if( userVal===1 ) {
            const url = 
                `${process.env.OPERATOR_HOST}/aviator?` +
                `user=${ launcher.user }` +
                `&token=${ userInfo.token }` +
                `&lang=${ launcher.lang }` +
                `&currency=${ launcher.currency }` +
                `&operator=7kbetbr` +
                `&return_url=https%3A%2F%2F7k.bet.br%2Fgame-error`;

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
                description : "Insert New User Failed"
            }
            return response;
        } else {
            const response = {
                error : userVal,
                description : "User Not Found"
            }
            return response;
        }
    },
}