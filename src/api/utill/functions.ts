import { customAlphabet } from 'nanoid';

export const generateRandString = ( user:string, len: number, flag: number ) => {
    const nanoidHex = customAlphabet( '0123456789abcdefghijklmnopqrstuvwxyz', len );
    let suffix = nanoidHex();
    let randTxt = "";
    if( flag===0 ) { // user's token
        randTxt = user + "-a9ec1d2dfe75db61ef8af22c558266e7a148bb316a92ead075dbb583bafc0099";
    } else if( flag===1 ) { // tk
        randTxt = "32a20f2bc3a0ee4dc33c88eecf0cd752";
    }
    return randTxt;
}
