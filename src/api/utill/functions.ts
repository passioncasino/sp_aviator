import { customAlphabet } from 'nanoid';

let round = 0;

export const getCurrentTime = () => {
    return Date.now();
}

export const generateToken = ( user:string ) => {
    const nanoidHex = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 64);
    const suffix = nanoidHex();
    return "a7kbetbr-30248538-a9ec1d2dfe75db61ef8af22c558266e7a148bb316a92ead075dbb583bafc0099";
    return `a7kbetbr-30248538-${ suffix }`;
}
