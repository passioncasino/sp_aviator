import * as storeUtils from "@/api/models";
import avaiatorFuctions from '@/api/game/aviator/functions';
import { generateRandString, generateServerSeed } from '@/api/utill/functions';
import { aviatorStatus } from "../../utill/global"
import { binaryToInfo, InfoToBinary } from '@/api/utill/spribe';
import { IAct0Params, IAct1Params, IBet, Icoh, IUCCOParams, IUPlayer, IStaker } from "@/api/utill/interface";

export const msgHandler = {
    getResponseMsg: async( msg: any, socketId: string ) => {
        const binaryData: any = [];
        const cids: number[] = [];
        const actions: number[] = [];
        const { action, cid, paramInfo } = binaryToInfo( msg );
        const controller = action==13 ? paramInfo._dataHolder.get("c").value : "none";

        let msgParams: any[] = [];
        let msgData: any = null;
        
        actions.push( action );
        cids.push( cid );      
      
        console.log(`>---- socketId=${ socketId }, round is ${ aviatorStatus.roundId }, crashX=${ aviatorStatus.crashX }, state=${aviatorStatus.state} action=${action}, cid=${cid}, controller=${controller} ----<`);

        switch ( action ) {
            case 0:
                aviatorStatus.state = 1;
                aviatorStatus.multiplier = 1.00;
                const act0Param: IAct0Params = {
                    ct: 1024,
                    ms: 500000,
                    tk: "32a20f2bc3a0ee4dc33c88eecf0cd752"
                }
                msgParams = avaiatorFuctions.generateAct0Params( act0Param );
                break;
            case 1:
                msgData = avaiatorFuctions.analyzeMsg( action, controller, paramInfo );
                const userInfo = await storeUtils.getUserInfo( msgData.un.split("&&")[ 0 ], "username" );
                if( userInfo!==500 && userInfo!==3001 ) {
                    if( userInfo.property.username==msgData.un.split("&&")[ 0 ]) {
                        const updateProperty = await storeUtils.updateUserProperty( userInfo.property.username, socketId, msgData.sessionToken );
                        // const currentPlayerSeeds = await storeUtils.
                        const pastGames = await storeUtils.getPastGamesInfo( 1 );

                        if( updateProperty!==501 && pastGames !== 501 ) {
                            const act1Param: IAct1Params = {
                                userId: msgData.un,
                                balance: userInfo.balance,
                                property: userInfo.property,
                                pastGames
                            }
                            cids.push( 1 );
                            actions.push( 13 );
                            msgParams = avaiatorFuctions.generateAct1Params( act1Param );
                        }
                    } else {
                        console.log(`wrong username`);
                    }
                } else {
                    console.log(`wrong user`);
                }
                break;
            case 13:
                const pData = paramInfo._dataHolder.get("p").value._dataHolder;
                msgData = avaiatorFuctions.analyzeMsg( action, controller, pData );
                if( 
                    controller==="betHandler" || 
                    controller==="betHistoryHandler" || 
                    controller==="cancelBetHandler" ||
                    controller==="cashOutHandler" 
                ) {
                    const user = await storeUtils.getUserInfo( socketId, "socket" );
                    if( user===3001 || user===500 ) return 0;

                    switch (controller) {
                        case "betHandler":
                            user.gameStatus.lastRound = aviatorStatus.roundId;
                            if( msgData.betId===1 ) {
                                user.gameStatus.f.betAmount = msgData.bet;
                                user.gameStatus.f.freeBet = msgData.freeBet;
                                if( msgData.autoCashOut!==undefined ) user.gameStatus.f.autoCashOut = msgData.autoCashOut;
                            } else {
                                user.gameStatus.s.betAmount = msgData.bet;
                                user.gameStatus.s.freeBet = msgData.freeBet;
                                if( msgData.autoCashOut!==undefined ) user.gameStatus.s.autoCashOut = msgData.autoCashOut;
                            }

                            user.gameStatus.stake = Math.round( user.gameStatus.f.betAmount*100 + user.gameStatus.s.betAmount*100 )/100;
                            user.balance = Math.round( user.balance*100 - user.gameStatus.stake*100 ) / 100;
                            aviatorStatus.stakers.push({
                                socketId,
                                balance: user.balance
                            })
                            const betSecParam = {
                                username: user.property.username,
                                operator: user.property.operator,
                                profile: user.property.profileImage
                            }
                            const betParams: IBet = { ...msgData, ...betSecParam };
                            const player = {
                                username: user.property.username,
                                roundId: aviatorStatus.roundId,
                                betAmount: user.gameStatus.stake,
                                winAmount: 0,
                                multiplier: 0,
                                betId: msgData.betId,
                                freeBet: msgData.freeBet,
                                currency: user.property.currency,
                                profileImage: user.property.profileImage,
                                cashOutDate: aviatorStatus.roundStartDate,
                                roundBetId: Date.now(),
                                clientSeed: msgData.clientSeed
                            };
                            const isPlayer = await storeUtils.insertPlayer( player );
                            msgParams = avaiatorFuctions.generateBetParams( betParams );
                            break;
                        case "betHistoryHandler":
                            const betHistory = await storeUtils.getUserBetHistory( user.property.username );
                            if( betHistory!==501 ) {
                                msgParams = avaiatorFuctions.generateUserBetHistory( betHistory );
                            }
                            break;
                        case "cancelBetHandler":
                            let reward = 0;
                            if( msgData.betId===1 ) {
                                user.gameStatus.stake = Math.round( user.gameStatus.stake*100-user.gameStatus.f.betAmount*100 )/ 100;
                                reward = Math.round( reward*100+user.gameStatus.f.betAmount*100 )/ 100;
                                user.gameStatus.f.betAmount = 0;
                                user.gameStatus.f.autoCashOut = 0;
                            } else {
                                user.gameStatus.stake = Math.round( user.gameStatus.stake*100-user.gameStatus.s.betAmount*100 )/ 100;
                                reward = Math.round( reward*100+user.gameStatus.s.betAmount*100 )/ 100;
                                user.gameStatus.s.betAmount = 0;
                                user.gameStatus.s.autoCashOut = 0;
                            }
                            user.balance = Math.round( user.balance*100 + reward*100 ) / 100;
                            aviatorStatus.stakers.push({
                                socketId,
                                balance: user.balance
                            })
                            user.gameStatus.lastRound = 0;
                            msgParams = avaiatorFuctions.generateCBParams( msgData.betId, user.property.username, user.property.operator );
                            const cancelPlayer = await storeUtils.deletePlayer( user.property.username, msgData.betId );
                            break;
                        case "cashOutHandler":
                            user.gameStatus.lastRound = 0;
                            const cashout = Math.round( user.gameStatus.stake*aviatorStatus.multiplier*100 ) / 100;
                            const uPlayer: IUPlayer = {
                                roundId: aviatorStatus.roundId,
                                username: user.property.username,
                                cashout,
                                multiplier: aviatorStatus.multiplier,
                                cashOutDate: Date.now()
                            }

                            if( msgData.betId===1 ) {
                                user.gameStatus.stake = Math.round( user.gameStatus.stake*100-user.gameStatus.f.betAmount*100 )/ 100;
                                user.gameStatus.f.betAmount = 0;
                                user.gameStatus.f.autoCashOut = 0;
                            } else {
                                user.gameStatus.stake = Math.round( user.gameStatus.stake*100-user.gameStatus.s.betAmount*100 )/ 100;
                                user.gameStatus.s.betAmount = 0;
                                user.gameStatus.s.autoCashOut = 0;
                            }

                            const isUpdate = await storeUtils.updatePlayer( uPlayer );
                            if( isUpdate===1 ) {
                                const cashoutParams: Icoh = {
                                    username: user.property.username,
                                    operator: user.property.operator,
                                    betId: msgData.betId,
                                    betAmount: user.gameStatus.stake,
                                    multiplier: aviatorStatus.multiplier,
                                    cashout
                                }
                                msgParams = avaiatorFuctions.generateCashOutParams( cashoutParams );
                            }
                            user.balance = Math.round( user.balance*100+cashout*100 ) / 100;
                            aviatorStatus.stakers.push({
                                socketId,
                                balance: user.balance
                            })
                            break;
                    }
                    
                    if( controller==="betHandler" || 
                        controller==="cancelBetHandler" || 
                        controller==="cashOutHandler" 
                    ) {
                        await storeUtils.updateBalance( socketId, user.balance );
                        await storeUtils.updateUserGameStatus( user.property.username, user.gameStatus );
                    }
                } else {
                    switch (controller) {
                        case "changeProfileImageHandler":
                            console.log(`${controller} `, msgData.profile);
                            await storeUtils.updateUserProfile( socketId, msgData.profile );
                            msgParams = avaiatorFuctions.generateCPIHParams( msgData.profile );
                            break;
                        case "currentBetsInfoHandler":
                            const players = await storeUtils.getPlayerList( 0 );
                            if( players !== 501 && players !== undefined ) {
                                if( !avaiatorFuctions.isStringArray( players ) ) msgParams = avaiatorFuctions.generateCBIHParams( players );
                            } else {
                                console.log(`players=${players}`);
                            }
                            break;
                        case "getHugeWinsInfoHandler":
                            const hugeWins = await storeUtils.getHugeWinInfo();
                            if( hugeWins!==501 ) msgParams = avaiatorFuctions.generateHWIHParams( hugeWins );
                            break;
                        case "getTopRoundsInfoHandler":
                            const topRounds = await storeUtils.getTopRounds();
                            if( topRounds!==501 ) msgParams = avaiatorFuctions.generateGTRIHParams( topRounds );
                            else console.log(`topRounds =`, topRounds );
                            break;
                        case "getTopWinsInfoHandler":
                            const topWins = await storeUtils.getPastGamesInfo( 0 );
                            if( topWins!==501 ) msgParams = avaiatorFuctions.generateGTWIParams( topWins );
                            break;
                        case "previousRoundInfoHandler":
                            const prevGameInfo = await storeUtils.getPrevGameInfo( aviatorStatus.roundId-1, 0 );
                            console.log(`prevGameInfo =`, prevGameInfo);
                            if( prevGameInfo!==501 ) {
                                if( prevGameInfo!==1 ) {
                                    msgParams = avaiatorFuctions.generatePRIRParams( prevGameInfo.prevGame, prevGameInfo.prevBets );
                                } else {
                                    // msgParams = avaiatorFuctions.generatePRIRParams( [], [] );
                                }
                            } else {
    
                            }
                            break;
                        case "PING_REQUEST":
                            msgParams = avaiatorFuctions.generatePingResponseParams();
                            break;
                        case "roundFairnessHandler":
                            const roundGame = await storeUtils.getPrevGameInfo( msgData.roundId, 1 );
                            if( roundGame !== 501 && roundGame !== 1 ) {
                                const playersInRound = await storeUtils.getPlayersInfoByRound( msgData.roundId, roundGame.prevGame.playerSeeds );
                                if( playersInRound !== 501 ) {
                                    msgParams = avaiatorFuctions.generateRFHParams( roundGame.prevGame, playersInRound );
                                }
                            }
                            break;
                        case "serverSeedHandler":
                            msgParams = avaiatorFuctions.generateServerSeed( aviatorStatus.serverSeed );
                            break;
                        case "setPlayerSettingHandler":
                            msgParams = avaiatorFuctions.generateSPSRParams();
                            break;
                    }
                }
                break;
        }
        msgParams.forEach(( obj, ind ) => {
            const msgData = InfoToBinary( actions[ ind ], cids[ ind ], obj );
            binaryData.push( msgData );
        });
        return binaryData;
    },
    getGameMultiplier: async() => {
        let binaryArr: any[] = [];
        let resParamArr: any[] = [];
        let paramObj: any = null;
        let cid=1;
        let uccoFlag = false; 

        if ( aviatorStatus.state===0 ) {
            const moment = Date.now();
            if( aviatorStatus.step===0 && moment-aviatorStatus.roundEndDate>200 ) {
                aviatorStatus.step++;
                paramObj = avaiatorFuctions.generateRCIParams( aviatorStatus.multiplier, aviatorStatus.roundId );
            } else if( aviatorStatus.step===1 && moment-aviatorStatus.roundEndDate>5700 ) { // gameStart
                const players = await storeUtils.getPlayerList( 1 );
                if( players!==501 && players !== undefined ) {
                    if( avaiatorFuctions.isStringArray( players ) ) {
                        const prevGame = {
                            roundId: aviatorStatus.roundId,
                            maxMultiplier: aviatorStatus.multiplier,
                            roundStartDate: aviatorStatus.roundStartDate,
                            roundEndDate: aviatorStatus.roundEndDate,
                            serverSeed: aviatorStatus.serverSeed,
                            totalCashOut: 0,
                            playerSeeds: players
                        }
                        await storeUtils.insertPreviousGame( prevGame );
                    }
                    await storeUtils.updatePlayersAfterCrash( aviatorStatus.roundId, aviatorStatus.multiplier );
                    aviatorStatus.step++;
                    aviatorStatus.roundId++;
                    aviatorStatus.multiplier = 1;
                    aviatorStatus.serverSeed = generateRandString( "", 40, 1 );
                    const seed = generateServerSeed();
                    paramObj = avaiatorFuctions.generateCSParams( aviatorStatus.roundId, 1 );
                }
            } else if( aviatorStatus.step===2 ) { // show animation
                if( moment-aviatorStatus.roundEndDate>11000 ) {
                    let rtp = 97;
                    paramObj = avaiatorFuctions.generateCSParams( aviatorStatus.roundId, 2 );
                    aviatorStatus.step = 0;
                    aviatorStatus.state = 1;
                    const playerSeeds = await storeUtils.getPlayerList( 1 );
                    console.log(`playerSeeds `, playerSeeds);
                    if( playerSeeds!==501 && avaiatorFuctions.isStringArray(playerSeeds) ) {
                        aviatorStatus.crashX = avaiatorFuctions.gameResult( rtp, aviatorStatus.serverSeed, playerSeeds );
                    } else {
                        aviatorStatus.crashX = 1.0;
                    }
                }
            }
        } else if ( aviatorStatus.state===1 ) {
            if( aviatorStatus.multiplier===1 ) {
                console.log(`getGameMultiplier crashX=${ aviatorStatus.crashX }, serverSeed=${ aviatorStatus.serverSeed } `);
                aviatorStatus.roundStartDate = Date.now();
                aviatorStatus.stakers.length = 0;
            }
            aviatorStatus.multiplier = Math.round( aviatorStatus.multiplier*100+1 ) / 100;
            if( aviatorStatus.multiplier*100%4===3 ) {
                uccoFlag = true;
            }
            if( aviatorStatus.multiplier > aviatorStatus.crashX-0.02 ) {
                aviatorStatus.state++;
            }
            paramObj = avaiatorFuctions.generateXParams( false, aviatorStatus.multiplier );
        } else if( aviatorStatus.state==2 ) {
            paramObj = avaiatorFuctions.generateXParams( true, aviatorStatus.crashX );
            aviatorStatus.roundEndDate = Date.now();
            aviatorStatus.state = 0;
        }
        
        if( !uccoFlag && paramObj !== null ) {
            resParamArr = resParamArr.concat( paramObj );
        }
        if( uccoFlag ) { // updateCurrentCashOuts
            const topImages = [ 'av-26.png', 'av-63.png', 'av-50.png' ];
            const uccoParams: IUCCOParams = {
                openBetsCount: 3915,
                activePlayersCount: 2326,
                totalCashOut: 1690,
                topImages
            }
            paramObj = avaiatorFuctions.generateUCCOParams( uccoParams );
            resParamArr = resParamArr.concat( paramObj );
        }

        if( resParamArr.length>0 ) {
            resParamArr.forEach(( obj:any ) => {
                const msgData = InfoToBinary( 13, cid, obj );
                binaryArr.push( msgData );
            });
        }
        return binaryArr;
    },
    getPlayerBalance: ( staker: IStaker ) => {
        const msgParams = avaiatorFuctions.generateNewBalanceParams( staker.balance );
        const biData = InfoToBinary( 13, 1, msgParams[0] );
        aviatorStatus.stakers = aviatorStatus.stakers.filter( uStaker => uStaker.socketId !== staker.socketId );
        return biData;
    }
}
