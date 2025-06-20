import { v4 as uuidv4 } from "uuid";

let round = 0;


export const getCurrentTime = () => {
    return new Date().getTime();
}

export const generateToken = async( mode:string, key1:string, key2:string ) => {
    const now = Date.now().toString();
    const data = new TextEncoder().encode(`${key1}:${key2}:${now}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const tt = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const uuid = uuidv4();
    const token = `${ mode==="real"? "AUTH" : "FUN" }TOKEN@${tt}~stylename@generic~SESSION@${uuid}`;
    return token;
}

export const generateRoundNo = ( envID:number ) => {
    round++;
    if( round>999 ) round = 0;
    const now = getCurrentTime();
    const roundNo = "" + Math.round(now/15000) + envID.toString().padStart(3, '0') + round.toString().padStart(3, '0');
    return Number(roundNo);
}
