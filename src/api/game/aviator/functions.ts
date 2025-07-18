import { TsfsItem, TsfsArrItem, IAct0Params, IAct1Params, IBet, Icoh, IUCCOParams, IPlayerRound } from "@/api/utill/interface";
import { aviatorStatus, CurrencyList } from "@/api/utill/global";
import crypto from 'crypto';

const SFS2X = require("sfs2x-api");

const putDatas = ( tObj: any, src: TsfsItem[] ) => {
  src.forEach((item) => {
    switch (item.type) {
      case 1 :
        tObj.putBool( item.prop, item.value );
        break;
      case 3 :
        tObj.putShort( item.prop, item.value );
        break;
      case 4 :
        tObj.putInt( item.prop, item.value );
        break;
      case 5 :
        tObj.putLong( item.prop, item.value );
        break;
      case 7 :
        tObj.putDouble( item.prop, item.value );
        break;
      case 8 :
        tObj.putUtfString( item.prop, item.value );
        break;
      case 17 :
        tObj.putSFSArray( item.prop, item.value );
        break;
      case 18 :
        tObj.putSFSObject( item.prop, item.value );
        break;
    }
  })
}

const addDataToArray = ( tArr: any, src: TsfsItem[] | TsfsArrItem[] ) => {
  src.forEach((item) => {
    switch ( item.type ) {
      case 1:
        tArr.addBool( item.value );
        break;
      case 3:
        tArr.addShort( item.value );
        break;
      case 4:
        tArr.addInt( item.value );
        break;
      case 5 :
        tArr.addLong( item.value );
        break;
      case 8:
        tArr.addUtfString( item.value );
        break;
      case 17:
        tArr.addSFSArray( item.value );
        break;
      case 18:
        tArr.addSFSObject( item.value );
        break;
    }
  })
}

const generateParentObj = ( controller: string, pObj: any ) => {
  const parentObj = new SFS2X.SFSObject();
  const parentData: TsfsItem[] = [
    { prop: "p", type: 18, value: pObj },
    { prop: "c", type: 8, value: controller }
  ];
  putDatas( parentObj, parentData );
  return parentObj;
}

const generateProfileArr = ( profiles: string[] ) => {
  const pTopPlayerProfileImages = new SFS2X.SFSArray();
  profiles.forEach((profile) => {
    pTopPlayerProfileImages.addUtfString( profile );
  })
  return pTopPlayerProfileImages;
}

const analyzeMsg = ( action: number, controller: string, paramInfo: any  ) => {
  const data: any = {};
  switch (action) {
    case 1:
      const p = paramInfo._dataHolder.get("p").value._dataHolder;
      const un = paramInfo._dataHolder.get("un").value;
      const token = p.get("token").value;
      data.token = token;
      data.un = un; //.split("&&")[0]
      data.sessionToken = p.get("sessionToken").value;
      break;
    case 13:
      console.log(`<==================== ${controller} ====================>`);
      console.log(`  paramInfo =`, paramInfo);
      console.log(`<=======================================>`);
      switch (controller) {
        case "betHandler":
          data.bet = paramInfo.get("bet").value;
          data.clientSeed = paramInfo.get("clientSeed").value;
          data.betId = paramInfo.get("betId").value;
          data.freeBet = paramInfo.get("freeBet").value;
          console.log(`====> autoCashOut ::`, paramInfo.get("autoCashOut"));
          if( paramInfo.get("autoCashOut") !== undefined ) {
            data.autoCashOut = paramInfo.get("autoCashOut").value;
          }
          break;
        case "cancelBet":
        case "cancelBetHandler":
        case "cashOutHandler":
          data.betId = paramInfo.get("betId").value;
          break;
        case "changeProfileImageHandler":
          data.profile = paramInfo.get("profileImage").value;
          break;
        case "roundFairnessHandler":
          data.roundId = paramInfo.get("roundId").value;
          break;
        }
  }
  return data;
}

const generateAct0Params = ( param: IAct0Params ) => {
  let paramArr: any[] = [];
  const paramObj = new SFS2X.SFSObject();
  const infoData: TsfsItem[] = [
    { prop: "ct", type: 4, value: param.ct },
    { prop: "ms", type: 4, value: param.ms },
    { prop: "tk", type: 8, value: param.tk },
  ];
  putDatas( paramObj, infoData );

  paramArr.push( paramObj );
  return paramArr;
}

const generateAct1Params = ( param: IAct1Params ) => {
  let paramArr: any[] = [];
  const empArr = new SFS2X.SFSArray();
  for (let i = 0; i < 2; i++) {
    const paramObj = new SFS2X.SFSObject();
    if( i===0 ) {
      const rlArr = new SFS2X.SFSArray();
      const pRlArr = new SFS2X.SFSArray();
      const rlData: TsfsArrItem[] = [
        { type: 4, value: 0 },
        { type: 8, value: 'game_state' },
        { type: 8, value: 'default' },
        { type: 1, value: false },
        { type: 1, value: false },
        { type: 1, value: false },
        { type: 3, value: 0 },
        { type: 3, value: 20 },
        { type: 17, value: empArr }
      ];
      addDataToArray( rlArr, rlData );
      pRlArr.addSFSArray( rlArr );

      const data0: TsfsItem[] = [
        { prop: "rs", type: 3, value: 0 },
        { prop: "zn", type: 8, value: 'aviator_core_inst4_sa' },
        { prop: "un", type: 8, value: param.userId },
        { prop: "pi", type: 3, value: 0 },
        { prop: "rl", type: 17, value: pRlArr },
        { prop: "id", type: 4, value: aviatorStatus.roundId }
      ];
      putDatas( paramObj, data0 );
      paramArr.push( paramObj );
    } else {
      const pObj2 = new SFS2X.SFSObject();
      const roundsInfoArr = new SFS2X.SFSArray();
      const userSettingsObj = new SFS2X.SFSObject();
      const userObj = new SFS2X.SFSObject();
      const configObj = new SFS2X.SFSObject();
      const configBetOptionsArr = new SFS2X.SFSArray();
      const configAutoCashOutObj = new SFS2X.SFSObject();
      const configEngagementToolsObj = new SFS2X.SFSObject();
      const configChatObj = new SFS2X.SFSObject();
      const configChatPromoObj = new SFS2X.SFSObject();
      const configChatRainObj = new SFS2X.SFSObject();

      console.log(`--> param.property`, param.property);
      param.pastGames.forEach((element) => {
        const roundObj = new SFS2X.SFSObject();
        const roundData: TsfsItem[] = [
          { prop: "maxMultiplier", type: 7, value: element.maxMultiplier },
          { prop: "roundId", type: 4, value: element.roundId }
        ];
        putDatas( roundObj, roundData );
        roundsInfoArr.addSFSObject( roundObj );
      });

      const userSettingData: TsfsItem[] = [
        { prop: "music", type: 1, value: true },
        { prop: "sound", type: 1, value: true },
        { prop: "secondBet", type: 1, value: true },
        { prop: "animation", type: 1, value: true }
      ];

      putDatas( userSettingsObj, userSettingData );

      const userData: TsfsItem[] = [
        { prop: "settings", type: 18, value: userSettingsObj },
        { prop: "balance", type: 7, value: param.balance },
        { prop: "profileImage", type: 8, value: param.property.profileImage },
        { prop: "userId", type: 8, value: param.userId },
        { prop: "username", type: 8, value: param.property.username },
      ];
      putDatas( userObj, userData );

      const configBetOptionsData: TsfsArrItem[] = [
        { type: 4, value: 10 },
        { type: 4, value: 20 },
        { type: 4, value: 50 },
        { type: 4, value: 100 }
      ];
      addDataToArray( configBetOptionsArr, configBetOptionsData );

      const configAutoCashOutData: TsfsItem[] = [
        { prop: "minValue", type: 7, value: 1.01 },
        { prop: "defaultValue", type: 7, value: 1.1 },
        { prop: "maxValue", type: 7, value: 1.00 },
      ];
      putDatas( configAutoCashOutObj, configAutoCashOutData );

      const configEngagementToolsData: TsfsItem[] = [
        { prop: "isExternalChatEnabled", type: 1, value: false }
      ];
      putDatas( configEngagementToolsObj, configEngagementToolsData );

      const configChatPromoData: TsfsItem[] = [
        { prop: "isExternalChatEnabled", type: 1, value: false }
      ];
      putDatas( configChatPromoObj, configChatPromoData );

      const configChatRainData: TsfsItem[] = [
        { prop: "isEnabled", type: 1, value: false },
        { prop: "rainMinBet", type: 7, value: 1 },
        { prop: "defaultNumOfUsers", type: 4, value: 5 },
        { prop: "minNumOfUsers", type: 4, value: 3 },
        { prop: "maxNumOfUsers", type: 4, value: 10 },
        { prop: "rainMaxBet", type: 7, value: 50 },
      ];
      putDatas( configChatRainObj, configChatRainData );

      const configChatData: TsfsItem[] = [
        { prop: "promo", type: 18, value: configChatPromoObj },
        { prop: "rain", type: 18, value: configChatRainObj },
        { prop: "isGifsEnabled", type: 1, value: true },
        { prop: "sendMessageDelay", type: 7, value: 5000 },
        { prop: "isEnabled", type: 1, value: false },
        { prop: "maxMessages", type: 4, value: 70 },
        { prop: "maxMessageLength", type: 4, value: 160 },
      ];
      putDatas( configChatObj, configChatData );

      const configData: TsfsItem[] = [
        { prop: "isAutoBetFeatureEnabled", type: 1, value: true },
        { prop: "betPrecision", type: 4, value: 2 },
        { prop: "maxBet", type: 7, value: 500 },
        { prop: "isAlderneyModalShownOnInit", type: 1, value: false },
        { prop: "isCurrencyNameHidden", type: 1, value: false },
        { prop: "isLoginTimer", type: 1, value: false },
        { prop: "isClockVisible", type: 1, value: false },
        { prop: "isBetsHistoryEndBalanceEnabled", type: 1, value: false },
        { prop: "betInputStep", type: 7, value: 1 },
        { prop: "isGameRulesHaveMaxWin", type: 1, value: false },
        { prop: "isBetsHistoryStartBalanceEnabled", type: 1, value: false },
        { prop: "isMaxUserMultiplierEnabled", type: 1, value: false },
        { prop: "isShowActivePlayersWidget", type: 1, value: true },
        { prop: "backToHomeActionType", type: 8, value: "navigate" },
        { prop: "inactivityTimeForDisconnect", type: 4, value: 0 },
        { prop: "isActiveGameFocused", type: 1, value: false },
        { prop: "isNetSessionEnabled", type: 1, value: false },
        { prop: "fullBetTime", type: 4, value: 5000 },
        { prop: "minBet", type: 7, value: 1 },
        { prop: "isGameRulesHaveMinimumBankValue", type: 1, value: false },
        { prop: "isShowTotalWinWidget", type: 1, value: true },
        { prop: "isShowBetControlNumber", type: 1, value: false },
        { prop: "betOptions", type: 17, value: configBetOptionsArr },
        { prop: "modalShownOnInit", type: 8, value: "none" },
        { prop: "isLiveBetsAndStatisticsHidden", type: 1, value: false },
        { prop: "onLockUIActions", type: 8, value: "cancelBet" },
        { prop: "isEmbeddedVideoHidden", type: 1, value: false },
        { prop: "isBetTimerBranded", type: 1, value: true },
        { prop: "defaultBetValue", type: 7, value: 1 },
        { prop: "maxUserWin", type: 7, value: 50000 },
        { prop: "isUseMaskedUsername", type: 1, value: true },
        { prop: "isShowWinAmountUntilNextRound", type: 1, value: false },
        { prop: "multiplierPrecision", type: 4, value: 2 },
        { prop: "autoCashOut", type: 18, value: configAutoCashOutObj },
        { prop: "isMultipleBetsEnabled", type: 1, value: true },
        { prop: "engagementTools", type: 18, value: configEngagementToolsObj },
        { prop: "isFreeBetsEnabled", type: 1, value: true },
        { prop: "pingIntervalMs", type: 4, value: 15000 },
        { prop: "isLogoUrlHidden", type: 1, value: false },
        { prop: "chatApiVersion", type: 4, value: 2 },
        { prop: "currency", type: 8, value: 'BRL' },
        { prop: "showCrashExampleInRules", type: 1, value: false },
        { prop: "isPodSelectAvailable", type: 1, value: false },
        { prop: "isBalanceValidationEnabled", type: 1, value: true },
        { prop: "isHolidayTheme", type: 1, value: false },
        { prop: "isGameRulesHaveMultiplierFormula", type: 1, value: false },
        { prop: "accountHistoryActionType", type: 8, value: 'navigate' },
        { prop: "chat", type: 18, value: configChatObj },
        { prop: "ircDisplayType", type: 8, value: 'modal' },
        { prop: "gameRulesAutoCashOutType", type: 8, value: 'default' }
      ];
      putDatas( configObj, configData );

      const pData: TsfsItem[] = [
        { prop: "roundsInfo", type: 17, value: roundsInfoArr },
        { prop: "code", type: 4, value: 200 },
        { prop: "activeBets", type: 17, value: empArr },
        { prop: "onlinePlayers", type: 4, value: aviatorStatus.onlinePlayers },
        { prop: "activeFreeBetsInfo", type: 17, value: empArr },
        { prop: "user", type: 18, value: userObj },
        { prop: "config", type: 18, value: configObj },
        { prop: "roundId", type: 4, value: aviatorStatus.roundId },
        { prop: "stageId", type: 4, value: 2 },
        { prop: "currentMultiplier", type: 7, value: aviatorStatus.multiplier },
      ];
      putDatas( pObj2, pData );
      
      const parentObj = generateParentObj( "init", pObj2 );
      paramArr.push( parentObj );
    }
  }
  return paramArr;
}

const generateBetParams = ( param: IBet ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "bet", type: 7, value: param.bet },
    { prop: "code", type: 4, value: 200 },
    { prop: "player_id", type: 8, value: `${ param.username }&&${ param.operator }` },
    { prop: "freeBet", type: 1, value: param.freeBet },
    { prop: "betId", type: 4, value: param.betId },
    { prop: "profileImage", type: 8, value: param.profile },
    { prop: "username", type: 8, value: param.username },
  ];
  putDatas( pObj, pDatas );
  const parentObj = generateParentObj( "bet", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateUserBetHistory = ( betHistory: SchemeHistory[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const betsArr = new SFS2X.SFSArray();
  betHistory.forEach((history) => {
    const subBetObj = new SFS2X.SFSObject();
    const betItem: TsfsItem[] = [
      { prop: "winAmount", type: 7, value: history.winAmount }, // CashOut BRL
      { prop: "maxMultiplier", type: 7, value: history.maxMultiplier },
      { prop: "isFreeBet", type: 1, value: history.freeBet },
      { prop: "payout", type: 7, value: history.multiplier },
      { prop: "bet", type: 7, value: history.betAmount },
      { prop: "roundBetId", type: 5, value: history.roundBetId },
      { prop: "betId", type: 4, value: history.betId },
      { prop: "currency", type: 8, value: CurrencyList[ history.currency ] },
      { prop: "cashOutDate", type: 5, value: history.cashOutDate },
      { prop: "roundId", type: 4, value: history.roundId },
      { prop: "win", type: 1, value: history.multiplier>1 ? true : false },
      { prop: "profit", type: 7, value: Math.round(history.betAmount*( history.multiplier-1 )*100)/100 }
    ];
    putDatas( subBetObj, betItem );
    betsArr.addSFSObject( subBetObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "isMorePagesAvailable", type: 1, value: true },
    { prop: "lastBetId", type: 5, value: 7133293763 },
    { prop: "bets", type: 17, value: betsArr },
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "betHistoryResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateCBParams = ( betId:number, username: string, operator: string ) => {
  console.log(` generateCBParams betId=${betId}, username=${username}, operator=${operator}`);
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "player_id", type: 8, value: `${ username }&&${ operator }` },
    { prop: "betId", type: 4, value: betId }
  ];
  putDatas( pObj, pDatas );
  const parentObj = generateParentObj( "cancelBet", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateCashOutParams = ( param: Icoh ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const cashoutsObj = new SFS2X.SFSObject();
  const pCashoutArr = new SFS2X.SFSArray();

  const cashoutDatas: TsfsItem[] = [
    { prop: "betAmount", type: 7, value: param.betAmount },
    { prop: "winAmount", type: 7, value: param.cashout },
    { prop: "player_id", type: 8, value: `${ param.username }&&${ param.operator }` },
    { prop: "betId", type: 4, value: param.betId },
    { prop: "isMaxWinAutoCashOut", type: 1, value: false }
  ];
  putDatas( cashoutsObj, cashoutDatas );
  pCashoutArr.addSFSObject( cashoutsObj );

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "cashouts", type: 17, value: pCashoutArr },
    { prop: "multiplier", type: 7, value: param.multiplier },
    { prop: "operatorKey", type: 8, value: param.operator }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "cashOut", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateCBIHParams = ( players: any[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pCashoutArr = new SFS2X.SFSArray();
  const pBetArr = new SFS2X.SFSArray();
  const profiles: string[] = [];

  players.forEach((player, ind) => {
    const pBetItemObj = new SFS2X.SFSObject();
    const operator = player.username.split("&&")[0];
    const betItem: TsfsItem[] = [
      { prop: 'bet', type: 7, value: player.betAmount },
      { prop: 'player_id', type: 8, value: `${ player.username }&&${ operator }` },
      { prop: 'betId', type: 4, value: player.betId },
      { prop: 'isFreeBet', type: 1, value: player.freeBet },
      { prop: 'currency', type: 8, value: CurrencyList[ player.currency ] },
      { prop: 'profileImage', type: 8, value: player.profileImage },
      { prop: 'username', type: 8, value: player.username }
    ];
    if( ind<3 ) profiles.push( player.profileImage );
    putDatas( pBetItemObj, betItem );
    pBetArr.addSFSObject( pBetItemObj );
    if( player.winAmount>0 ) {
      const pCashOutItemObj = new SFS2X.SFSObject();
      const cashOutItem: TsfsItem[] = [
        { prop: 'player_id', type: 8, value: `${ player.username }&&${ operator }` },
        { prop: 'winAmount', type: 7, value: player.winAmount },
        { prop: 'multiplier', type: 7, value: player.multiplier },
        { prop: 'betId', type: 4, value: player.betId },
        { prop: 'currency', type: 8, value: CurrencyList[ player.currency ]}
      ];
      putDatas( pCashOutItemObj, cashOutItem );
      pCashoutArr.addSFSObject( pCashOutItemObj );
    }
  })
  const pTopPlayerProfileImages = generateProfileArr( profiles );

  const pDatas: TsfsItem[] = [
    { prop: "betsCount", type: 4, value: 4177 },
    { prop: "openBetsCount", type: 4, value: 3891 },
    { prop: "code", type: 4, value: 200 },
    { prop: "cashOuts", type: 17, value: pCashoutArr },
    { prop: "activePlayersCount", type: 4, value: 2320 },
    { prop: "bets", type: 17, value: pBetArr },
    { prop: "topPlayerProfileImages", type: 17, value: pTopPlayerProfileImages },
    { prop: "totalCashOut", type: 7, value: 1690 },
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "currentBetsInfo", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = changeProfileImage
const generateCPIHParams = ( profile: string ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "profileImageName", type: 8, value: profile }
  ];
  putDatas( pObj, pDatas );
  
  const parentObj = generateParentObj( "changeProfileImage", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateCSParams = ( roundId: number, state: number ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "newStateId", type: 4, value: state },
    { prop: "code", type: 4, value: 200 },
    { prop: "roundId", type: 4, value: roundId }
  ];
  if( state===1 ) pDatas.push({ prop: "timeLeft", type: 4, value: 5000 });
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "changeState", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

export const generateNewBalanceParams = ( balance: number ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "newBalance", type: 7, value: balance }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "newBalance", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generatePingResponseParams = () => {
  let paramArr: any[] = [];
  const empObj = new SFS2X.SFSObject();
  const parentObj = generateParentObj( "PING_RESPONSE", empObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateRCIParams = ( mul: number, roundId: number ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "maxMultiplier", type: 7, value: mul },
    { prop: "roundId", type: 4, value: roundId }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "roundChartInfo", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = roundFairnessHandler
const generateRFHParams = ( game: SchemeGame, playersInRound: IPlayerRound[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pFairnessObj = new SFS2X.SFSObject();
  const pPlayerSeeds = new SFS2X.SFSArray();

  playersInRound.forEach(( item ) => {
    const subSeesObj = new SFS2X.SFSObject();
    const seedItem: TsfsItem[] = [
      { prop: 'seed', type: 8, value: item.seed },
      { prop: 'profileImage', type: 8, value: item.profileImage },
      { prop: 'username', type: 8, value: item.username }
    ];
    putDatas( subSeesObj, seedItem );
    pPlayerSeeds.addSFSObject( subSeesObj );
  })
  
  let seedSum = game.serverSeed;
  game.playerSeeds.forEach((seed) => { seedSum += seed });

  const seedSHA512 = crypto.createHash('sha512').update( seedSum ).digest('hex');
  const seedHex = seedSHA512.slice( 0, 13 );
  const seedDeci = parseInt( seedHex, 16 );
  console.log(`seedSHA512 =`, seedSHA512);
  const fairnessDatas: TsfsItem[] = [
    { prop: 'result', type: 7, value: game.maxMultiplier },
    { prop: 'number', type: 7, value: 139.21846839190917 },
    { prop: 'seedSHA256', type: 8, value: seedSHA512 },
    { prop: 'playerSeeds', type: 17, value: pPlayerSeeds },
    { prop: 'partSeedDecimalNumber', type: 5, value: seedDeci },
    { prop: 'partSeedHexNumber', type: 8, value: seedHex },
    { prop: 'roundStartDate', type: 5, value: game.roundStartDate },
    { prop: 'roundId', type: 4, value: game.roundId },
    { prop: 'serverSeed', type: 8, value: game.serverSeed }
  ];
  putDatas( pFairnessObj, fairnessDatas );
  
  const pDatas: TsfsItem[] = [
    { prop: 'fairness', type: 18, value: pFairnessObj },
    { prop: "code", type: 4, value: 200 }
  ];
  putDatas( pObj, pDatas );
  const parentObj = generateParentObj( "roundFairnessResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

const generateUCCOParams = ( params: IUCCOParams ) => {
  let paramArr: any[] = [];

  const uccPObj = new SFS2X.SFSObject();
  const pCashoutsArr = new SFS2X.SFSArray();
  const pTopPlayerProfileImages = new SFS2X.SFSArray();

  const pTopPlayerProfileData: TsfsArrItem[] = [];
  params.topImages.forEach((image) => {
    const item: TsfsArrItem = { type: 8, value: image };
    pTopPlayerProfileData.push( item );
  })
  addDataToArray( pTopPlayerProfileImages, pTopPlayerProfileData );

  const cashOutItemDatas: TsfsItem[][] = [
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_28066631&&sortenabetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 600 },
      { prop: 'multiplier', type: 7, value: 1.2 },
      { prop: 'betId', type: 4, value: 1 }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 372 },
      { prop: 'multiplier', type: 7, value: 1.24 },
      { prop: 'betId', type: 4, value: 1 }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 426 },
      { prop: 'multiplier', type: 7, value: 1.42 },
      { prop: 'betId', type: 4, value: 2 }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'nash-240992599&&onabetcombr'
      },
      { prop: 'winAmount', type: 7, value: 292 },
      { prop: 'multiplier', type: 7, value: 1.46 },
      { prop: 'betId', type: 4, value: 2 }
    ]
  ];
  
  cashOutItemDatas.forEach(( item ) => {
    const pCashOutsItemObj = new SFS2X.SFSObject();
    putDatas( pCashOutsItemObj, item );
    pCashoutsArr.addSFSObject( pCashOutsItemObj );
  })

  const cashOutPData: TsfsItem[] = [
    { prop: "openBetsCount", type: 4, value: params.openBetsCount },
    { prop: "code", type: 4, value: 200 },
    { prop: "cashouts", type: 17, value: pCashoutsArr },
    { prop: "activePlayersCount", type: 4, value: params.activePlayersCount },
    { prop: "totalCashOut", type: 7, value: params.totalCashOut },
    { prop: "topPlayerProfileImages", type: 17, value: pTopPlayerProfileImages }
  ];
  putDatas( uccPObj, cashOutPData );

  const parentObj = generateParentObj( "updateCurrentCashOuts", uccPObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = getHugeWinsInfoHandler
const generateHWIHParams = ( params: any[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const twArr = new SFS2X.SFSArray();

  params.forEach((item) => {
    const subTopWinObj = new SFS2X.SFSObject();
    const twItem: TsfsItem[] = [
      { prop: 'maxMultiplier', type: 7, value: item.maxMultiplier },
      { prop: 'winAmount', type: 7, value: item.winAmount },
      { prop: 'endDate', type: 5, value: item.cashOutDate },
      { prop: 'payout', type: 7, value: item.multiplier }, // winner's multiplier
      { prop: 'isFreeBet', type: 1, value: item.freeBet },
      { prop: 'profileImage', type: 8, value: item.profileImage },
      { prop: 'bet', type: 7, value: item.betAmount },
      { prop: 'roundBetId', type: 5, value: item.roundBetId },
      { prop: 'winAmountInMainCurrency', type: 7, value: 169.29 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: CurrencyList[ item.currency ]},
      { prop: 'roundId', type: 4, value: item.roundId },
      { prop: 'playerId', type: 4, value: 128250272 },
      { prop: 'username', type: 8, value: item.username }
    ];
    putDatas( subTopWinObj, twItem );
    twArr.addSFSObject( subTopWinObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "topWins", type: 17, value: twArr }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "getHugeWinsInfo", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = getTopRoundsInfoHandler
const generateGTRIHParams = ( topRounds: any[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pTopRoundsArr = new SFS2X.SFSArray();

  topRounds.forEach((item) => {
    const roundinfo: TsfsItem[] = [
      { prop: 'maxMultiplier', type: 7, value: item.maxMultiplier },
      { prop: 'endDate', type: 5, value: item.roundEndDate },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: item.roundStartDate },
      { prop: 'roundId', type: 4, value: item.roundId },
      { prop: 'serverSeed', type: 8, value: item.serverSeed }
    ];
    const subTopRoundsObj = new SFS2X.SFSObject();
    putDatas( subTopRoundsObj, roundinfo );
    pTopRoundsArr.addSFSObject( subTopRoundsObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "topRounds", type: 17, value: pTopRoundsArr }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "getTopRoundsInfo", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = getTopWinsInfoHandler
const generateGTWIParams = ( params: SchemeHistory[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pTopWinsArr = new SFS2X.SFSArray();
  
  params.forEach((item) => {
    const pTwObj = new SFS2X.SFSObject();
    const twItem: TsfsItem[] = [
      { prop: 'maxMultiplier', type: 7, value: item.maxMultiplier },
      { prop: 'winAmount', type: 7, value: item.winAmount },
      { prop: 'endDate', type: 5, value: item.cashOutDate },
      { prop: 'payout', type: 7, value: item.multiplier }, // winner's multiplier
      { prop: 'isFreeBet', type: 1, value: item.freeBet },
      { prop: 'profileImage', type: 8, value: item.profileImage },
      { prop: 'bet', type: 7, value: item.betAmount },
      { prop: 'roundBetId', type: 5, value: item.roundBetId },
      { prop: 'winAmountInMainCurrency', type: 7, value: 169.29 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: CurrencyList[ item.currency ]},
      { prop: 'roundId', type: 4, value: item.roundId },
      { prop: 'playerId', type: 4, value: 128250272 },
      { prop: 'username', type: 8, value: item.username }
    ];
    console.log(` getTopWinsInfo twItem is `, twItem);
    putDatas( pTwObj, twItem );
    pTopWinsArr.addSFSObject( pTwObj );
  });
  
  const pData: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "topWins", type: 17, value: pTopWinsArr },
  ];
  putDatas( pObj, pData );
  const parentObj = generateParentObj( "getTopWinsInfo", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = previousRoundInfoResponse
const generatePRIRParams = ( prevGame: SchemeGame, prevBets: SchemeHistory[] ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pBetsArr = new SFS2X.SFSArray();
  const pRoundInfoObj = new SFS2X.SFSObject();
  const pRoundInfoDatas: TsfsItem[] = [
    { prop: "multiplier", type: 7, value: prevGame.maxMultiplier },
    { prop: "roundStartDate", type: 5, value: prevGame.roundStartDate },
    { prop: "roundEndDate", type: 5, value: prevGame.roundEndDate },
    { prop: "roundId", type: 4, value: prevGame.roundId }
  ];
  putDatas( pRoundInfoObj, pRoundInfoDatas );

  prevBets.forEach((item) => {
    console.log(`item is `, item);
    const betItem = [
      { prop: 'bet', type: 7, value: item.betAmount },
      { prop: 'roundBetId', type: 5, value: item.roundBetId },
      { prop: 'winAmount', type: 7, value: item.winAmount },
      { prop: 'payout', type: 7, value: item.multiplier },
      { prop: 'isFreeBet', type: 1, value: item.freeBet },
      { prop: 'currency', type: 8, value: "BRL" },
      { prop: 'profileImage', type: 8, value: item.profileImage },
      { prop: 'win', type: 1, value: item.winAmount>0 ? true : false },
      { prop: 'username', type: 8, value: item.username }
    ];
    const subBetObj = new SFS2X.SFSObject();
    putDatas( subBetObj, betItem );
    pBetsArr.addSFSObject( subBetObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "roundInfo", type: 18, value: pRoundInfoObj },
    { prop: "code", type: 4, value: 200 },
    { prop: "bets", type: 17, value: pBetsArr }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "previousRoundInfoResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = serverSeedResponse
const generateServerSeed = ( seed: string ) => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "serverSeedSHA256", type: 8, value: seed },
    { prop: "code", type: 4, value: 200 },
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "serverSeedResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = setPlayerSettingResponse
const generateSPSRParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  pObj.putInt( "code", 200 );

  const parentObj = generateParentObj( "setPlayerSettingResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c = x
const generateXParams = ( cFlag: boolean, x: number ) => {
  let paramArr: any[] = [];
  const cxObj = new SFS2X.SFSObject();
  const cxDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "x", type: 7, value: x }
  ];
  putDatas( cxObj, cxDatas );
  
  const parentObj = generateParentObj( "x", cxObj );
  paramArr.push( parentObj );

  if( cFlag===true ) {
    const cFlagObj = new SFS2X.SFSObject();
    cxDatas.splice( 1, 0, { prop: "crashX", type: 7, value: x });
    putDatas( cFlagObj, cxDatas );
    const parentObj1 = generateParentObj( "x", cFlagObj );
    paramArr.push( parentObj1 );
  }

  return paramArr;
}

const gameResult = ( rtp: number, seed1: string, seed2Arr: string[] ) => {
  let seedCombine = seed1;
  seed2Arr.forEach((seed) => {
    seedCombine += seed;
  });
  const max = 4503599627370496;
  const seedSHA512 = crypto.createHash('sha512').update( seedCombine ).digest('hex');
  const seedHex = seedSHA512.slice( 0, 13 );
  const seedDeci = parseInt( seedHex, 16 );
  const crashX = parseFloat((seedDeci / max).toPrecision(9));
  let result = rtp / (1-crashX) / 100;
  console.log(`>-----------------------------------<`);
  console.log(`  crashX =`, crashX);
  console.log(`  result =`, result);
  console.log(`>-----------------------------------<`);
  return 1.09;
  return Math.max( 1, Math.round( result*100 )/100 );
}

const isStringArray = (arr: any): arr is string[] => {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

export default {
  analyzeMsg,
  generateAct0Params,
  generateAct1Params,

  generateBetParams,
  generateUserBetHistory,

  generateCBParams,
  generateCashOutParams,
  generateCBIHParams,
  generateCSParams,
  generateCPIHParams,

  generateGTWIParams,
  generateNewBalanceParams,
  generatePingResponseParams,
  generateRCIParams,
  generateRFHParams,
  generateUCCOParams,
  generateHWIHParams,
  generateGTRIHParams,
  generatePRIRParams,
  generateServerSeed,
  generateSPSRParams,
  generateXParams,

  gameResult,
  
  isStringArray
}