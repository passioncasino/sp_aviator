import { customAlphabet } from 'nanoid';

let round = 0;

export const getCurrentTime = () => {
    return Date.now();
}

export const generateToken = ( user:string ) => {
    const nanoidHex = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 64);
    const suffix = nanoidHex();
    return `a7kbetbr-30248538-${ suffix }`;
}

export const generateRoundNo = ( envID:number ) => {
    round++;
    if( round>999 ) round = 0;
    const now = getCurrentTime();
    const roundNo = "" + Math.round(now/15000) + envID.toString().padStart(3, '0') + round.toString().padStart(3, '0');
    return Number(roundNo);
}
