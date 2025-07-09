import crypto from 'crypto';

export const generateRandString = ( user:string, len: number, flag: number ) => {
    const suffix = crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0, len);
    console.log(`-----> suffix =`, suffix)
    
    let randTxt = "";
    if( flag===0 ) { // user's token
        randTxt = user + suffix;
    } else { // tk
        randTxt = suffix;
    }
    return randTxt;
}

export const generateServerSeed = () => {
    const rand = crypto.randomBytes(20);

}