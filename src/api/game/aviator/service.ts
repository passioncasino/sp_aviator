import { aviatorStatus } from './aviatorState';
import * as Functions from '@/api/game/aviator/functions';
import { binaryToInfo, InfoToBinary } from '@/api/utill/spribe';

export const aviatorService = {
    handleMsg: ( msg: any ) => {
        const binaryData: any = [];
    /*
        const data = Functions.generateGameStateMsg("updateCurrentCashOuts");
        const msgData1 = msgToBinary( 13, 1, data );
        binaryData.push( msgData1 );
        return binaryData;
    */
        const { action, cid, paramInfo } = binaryToInfo( msg );
        console.log(`action=${action}, cid=${cid}`);
        let controller = "none";
        
        // const msgData = Functions.analyzeMsg( action, paramInfo );
        // if( action===13 && cid===1 ) {
        //     console.log(`msgData`, msgData);
        //     if( msgData.c==="currentBetsInfoHandler" || msgData.c==="PING_REQUEST" ) {
        //         controller = msgData.c;
        //     }
        // }

        const paramObj = Functions.generateParamDataByMsg( action, cid );
        paramObj.forEach(( obj, ind ) => {
            const msgData = InfoToBinary( ind===0 ? action : 13, ind===0 ? cid : 1, obj );
            binaryData.push( msgData );
        });
        return binaryData;
    },
    sendGameStatus: () => { // action === 13
        let msgData: number[] = [];

        switch ( aviatorStatus._state ) {
            case 0:
                
                break;
            default:
                break;
        }
    }
}
