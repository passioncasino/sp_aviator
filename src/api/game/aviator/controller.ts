import { aviatorStatus } from "./global"
import { IAct0Params, IAct1Params, IBet, Icoh, IUCCOParams, IucbParams } from "@/api/utill/interface";
import modelUtils from "@/api/models";
import { binaryToInfo, InfoToBinary } from '@/api/utill/spribe';
import * as Functions from '@/api/game/aviator/functions';

const username = "a7kbetbr_30248538";

export const msgHandler = {
    getResponseMsg: async( msg: any ) => {
        const binaryData: any = [];
        const cids: number[] = [];
        const actions: number[] = [];
        const { action, cid, paramInfo } = binaryToInfo( msg );
        const controller = action==13 ? paramInfo._dataHolder.get("c").value : "none";

        let msgParams: any[] = [];
        let msgData: any = null;
        
        actions.push( action );
        cids.push( cid );
        
        const user = await modelUtils.getUserInfo( username );
        if( user===3001 || user===500 ) return 0;
        
        console.log(`>-- round is ${ aviatorStatus.roundId }, state=${aviatorStatus.state} action=${action}, cid=${cid}, controller=${controller} --<`);

        switch ( action ) {
            case 0:
                aviatorStatus.state = 1;
                aviatorStatus.multiplier = 1.00;
                console.log(`here state is 1`);
                const act0Param: IAct0Params = {
                    ct: 1024,
                    ms: 500000,
                    tk: "32a20f2bc3a0ee4dc33c88eecf0cd752"
                }
                msgParams = Functions.generateAct0Params( act0Param );
                break;
            case 1:
                actions.push( 13 );
                cids.push( 1 );
                msgData = Functions.analyzeMsg( action, controller, paramInfo );
                // console.log(`msgData = `, msgData);
                const userInfo = await modelUtils.getUserInfo( msgData.un.split("&&")[0] );
                if( userInfo!==500 && userInfo!==3001 ) {
                    const act1Param: IAct1Params = {
                        username: msgData.un,
                        // settings: userInfo.settings
                    }
                    msgParams = Functions.generateAct1Params( act1Param );
                }
                break;
            case 13:
                const pData = paramInfo._dataHolder.get("p").value._dataHolder;
                msgData = Functions.analyzeMsg( action, controller, pData );
                switch (controller) {
                    case "betHandler":
                        user.gameStatus.betAmount = msgData.bet;
                        user.gameStatus.betId = msgData.betId;
                        user.gameStatus.freeBet = msgData.freeBet;
                        user.balance = Math.round( user.balance*100 - user.gameStatus.betAmount*100 ) / 100;

                        const betSecParam = {
                            username,
                            operator: user.property.operator,
                            profile: user.property.profileImage
                        }
                        const betParams: IBet = { ...msgData, ...betSecParam }
                        const player = {
                            username: username,
                            roundId: aviatorStatus.roundId,
                            winAmount: 0,
                            multiplier: 0,
                            betId: msgData.betId,
                            freeBet: msgData.freeBet
                        };
                        const isPlayer = await modelUtils.insertPlayer( player );
                        console.log(`isPlayer = ${ isPlayer }`);
                        msgParams = Functions.generateBetParams( betParams );
                        break;
                    case "cancelBetHandler":
                        user.balance = Math.round( user.balance*100 + user.gameStatus.betAmount*100 ) / 100;
                        msgParams = Functions.generateCBParams( msgData.betId, user.property.username, user.property.operator );
                        break;
                    case "cashOutHandler":
                        console.log(`${controller}, multiplier=${aviatorStatus.multiplier}`);
                        const cashout = Math.round( user.gameStatus.betAmount*aviatorStatus.multiplier*100 ) / 100;

                        const cashoutParams: Icoh = {
                            username,
                            operator: user.property.operator,
                            betId: msgData.betId,
                            betAmount: user.gameStatus.betAmount,
                            multiplier: aviatorStatus.multiplier,
                            cashout
                        }
                        msgParams = Functions.generateCashOutParams( cashoutParams );
                        break;
                    case "currentBetsInfoHandler":
                        msgParams = Functions.generateCBIHParams();
                        break;
                    case "getHugeWinsInfoHandler":
                        msgParams = Functions.generateHWIHParams();
                        break;
                    case "getTopRoundsInfoHandler":
                        // const topRounds = await modelUtils.getTopRounds();
                        msgParams = Functions.generateGTRIHParams();
                        break;
                    case "previousRoundInfoHandler":
                        msgParams = Functions.generatePRIRParams();
                        break;
                    case "PING_REQUEST":
                        msgParams = Functions.generatePingResponseParams();
                        break;
                    case "setPlayerSettingResponse":
                        msgParams = Functions.generateSPSRParams();
                        break;
                }
                break;
        }
        await modelUtils.updateUserInfo( username, user.gameStatus );
        msgParams.forEach(( obj, ind ) => {
            const msgData = InfoToBinary( actions[ ind ], cids[ ind ], obj );
            binaryData.push( msgData );
        });
        return binaryData;
    },
    getGameMultiplier: () => {
        let binaryArr: any[] = [];
        let resParamArr: any[] = [];
        let paramObj: any = null;
        let cid=1;
        /**
         * ucco stands for updateCurrentCashOuts, 
         */
        let uccoFlag = false; 

        console.log(`getGameMultiplier roundStartDate=${aviatorStatus.roundStartDate}, state=${aviatorStatus.state}, step=${aviatorStatus.step}, multiplier=${aviatorStatus.multiplier} `);

        if ( aviatorStatus.state===0 ) {
            const moment = Date.now();
            if( aviatorStatus.step===0 && moment-aviatorStatus.roundEndDate>200 ) {
                aviatorStatus.step++;
                paramObj = Functions.generateRCIParams( aviatorStatus.multiplier, aviatorStatus.roundId );
            } else if( aviatorStatus.step===1 && moment-aviatorStatus.roundEndDate>5700 ) { // gameStart
                aviatorStatus.multiplier = 1;
                aviatorStatus.step++;
                aviatorStatus.roundId++;
                paramObj = Functions.generateCSParams( aviatorStatus.roundId, 1 );
            } else if( aviatorStatus.step===2 ) { // show animation
                if( moment-aviatorStatus.roundEndDate>11000 ) {
                    paramObj = Functions.generateCSParams( aviatorStatus.roundId, 2 );
                    aviatorStatus.step = 0;
                    aviatorStatus.state = 1;
                }
            }

        } else if ( aviatorStatus.state===1 ) {
            if( aviatorStatus.multiplier===1 ) {
                aviatorStatus.roundStartDate = Date.now();
            }
            aviatorStatus.multiplier = Math.round( aviatorStatus.multiplier*100+1 ) / 100;
            if( aviatorStatus.multiplier*100%4===3 ) {
                uccoFlag = true;
            }
            if( aviatorStatus.multiplier > aviatorStatus.crashX-0.02 ) {
                aviatorStatus.state++;
            }
            paramObj = Functions.generateXParams( false, aviatorStatus.multiplier );
        } else if( aviatorStatus.state==2 ) {
            paramObj = Functions.generateXParams( true, aviatorStatus.crashX );
            aviatorStatus.roundEndDate = Date.now();
            aviatorStatus.state = 0;
            console.log(`ended ${ aviatorStatus.roundEndDate }`);
        }
        
        if( !uccoFlag && paramObj !== null ) {
            resParamArr = resParamArr.concat( paramObj );
        }
        if( uccoFlag ) {
            const topImages = [ 'av-26.png', 'av-63.png', 'av-50.png' ];
            const uccoParams: IUCCOParams = {
                openBetsCount: 3915,
                activePlayersCount: 2326,
                totalCashOut: 1690,
                topImages
            }
            paramObj = Functions.generateUCCOParams( uccoParams );
            resParamArr = resParamArr.concat( paramObj );
        }
        if( resParamArr.length>0 ) {
            resParamArr.forEach(( obj:any ) => {
                const msgData = InfoToBinary( 13, cid, obj );
                binaryArr.push( msgData );
            });
        }
        // const msgData = InfoToBinary( 13, cid, paramObj );
        return binaryArr;
    }
}

export const userInfoHandler = {

}
