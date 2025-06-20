import * as Models from '@/common/models/index';
import * as GlobalFunctions from '@/api/utill/functions';
import { ILauncherParams } from '@/api/utill/interface';

export const commonService = {
    provideLauncher:async( launcher: ILauncherParams ) => {
        const userInfo : any = {};
        const now = GlobalFunctions.getCurrentTime();
        userInfo.token = await GlobalFunctions.generateToken( launcher.mode, launcher.user, launcher.token );
        userInfo.balance = 10000;
        userInfo.property = {
            callBack : launcher.callBack,
            rtp : launcher.rtp,
            game : launcher.game,
            lang : launcher.lang,
            user : launcher.user,
            currency : launcher.currency,
            mode : launcher.mode==="real" ? 1 : 0,
            bonus : 0,
            min : launcher.min,
            max : launcher.max
        };

        const userVal = await Models.addUser(userInfo);
        if( userVal===1 ) {
            const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
            const url = 
                `${protocol}://${process.env.HOST}`+
                `${ process.env.NODE_ENV === "development" ? `:${process.env.PORT}` : `` }` +
                `/vs/${ launcher.game }/openGame.do?extGame=1` +
                `&symbol=${ launcher.game }` +
                `&gname=pp` +
                `&mgckey=${userInfo.token}` +
                `&lang=${ userInfo.property.lang }` +
                `&cur=${ userInfo.property.currency }`;
    
       
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