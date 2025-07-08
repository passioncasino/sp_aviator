import { customAlphabet } from 'nanoid';
import crypto from 'crypto';

export const generateRandString = ( user:string, len: number, flag: number ) => {
    const rand = crypto.randomBytes(13);
    
    console.log(`-----> rand =`, rand)
    const stringCombination = flag < 2 ? "abcdefghijklmnopqrstuvwxyz0123456789" : "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nanoidHex = customAlphabet( stringCombination, len );
    let suffix = nanoidHex();
    let randTxt = "";
    if( flag===0 ) { // user's token
        randTxt = user + suffix;
        randTxt = user + "-a9ec1d2dfe75db61ef8af22c558266e7a148bb316a92ead075dbb583bafc0099";
    } else { // tk
        randTxt = suffix;
        // randTxt = "32a20f2bc3a0ee4dc33c88eecf0cd752";
    }
    return randTxt;
}

export const generateServerSeed = () => {
    const rand = crypto.randomBytes(20);

}
