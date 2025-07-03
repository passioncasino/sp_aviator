import { TsfsItem, TsfsArrItem, IStaticMsgParam, IAct0Params, IAct1Params, IBet, Icoh, IUCCOParams } from "@/api/utill/interface";

const SFS2X = require("sfs2x-api");

export const analyzeMsg = ( action: number, controller: string, paramInfo: any  ) => {
  const data: any = {};
  switch (action) {
    case 1:
      const p = paramInfo._dataHolder.get("p").value._dataHolder;
      const un = paramInfo._dataHolder.get("un").value;
      const token = p.get("token").value;
      data.token = token;
      data.un = un; //.split("&&")[0]
      break;
    case 13:
      console.log(`===> ${controller}'s paramInfo =`, paramInfo);
      switch (controller) {
        case "betHandler":
          data.bet = paramInfo.get("bet").value;
          data.clientSeed = paramInfo.get("clientSeed").value;
          data.betId = paramInfo.get("betId").value;
          data.freeBet = paramInfo.get("freeBet").value;
          break;
        case "cancelBet":
          data.betId = paramInfo.get("betId").value;
          break;
        case "cashOutHandler":
          data.betId = paramInfo.get("betId").value;
          break;
      }
  }
  return data;
}

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

export const generateAct0Params = ( param: IAct0Params ) => {
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

export const generateAct1Params = ( param: IAct1Params ) => {
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
        { prop: "un", type: 8, value: param.username },
        { prop: "pi", type: 3, value: 0 },
        { prop: "rl", type: 17, value: pRlArr },
        { prop: "id", type: 4, value: 3212110 }
      ];
      putDatas( paramObj, data0 );
      paramArr.push( paramObj );
    } else {
      const muls = [ 1, 1.77, 1.49, 6.79, 1.15, 1.77, 1.49, 6.79, 1.15, 1.77, 1.84, 4.26, 1.27, 1.85, 1.6, 8.85, 1.31, 7.72, 5.48, 1.29, 1.53, 1.7, 1.07, 2.94, 1.48, 3.5, 2.03, 1.14, 4.46 ];
      const rid = 2537417;
      const pObj2 = new SFS2X.SFSObject();
      const roundsInfo = new SFS2X.SFSArray();
      const userSettings = new SFS2X.SFSObject();
      const user = new SFS2X.SFSObject();
      const config = new SFS2X.SFSObject();
      const configBetOptions = new SFS2X.SFSArray();
      const configAutoCashOut = new SFS2X.SFSObject();
      const configEngagementTools = new SFS2X.SFSObject();
      const configChat = new SFS2X.SFSObject();
      const configChatPromo = new SFS2X.SFSObject();
      const configChatRain = new SFS2X.SFSObject();

      // for (let i = 0; i < muls.length; i++) {
      //   const roundObj = new SFS2X.SFSObject();
      //   roundObj.putDouble( "maxMultiplier", muls[ i ] );
      //   roundObj.putInt( "roundId", rid-i );
      //   roundsInfo.addSFSObject( roundObj );
      // }
      const userSettingData: TsfsItem[] = [
        { prop: "music", type: 1, value: true },
        { prop: "sound", type: 1, value: true },
        { prop: "secondBet", type: 1, value: true },
        { prop: "animation", type: 1, value: true }
      ];

      putDatas( userSettings, userSettingData );

      const userData: TsfsItem[] = [
        { prop: "settings", type: 18, value: userSettings },
        { prop: "balance", type: 7, value: 21.26 },
        { prop: "profileImage", type: 8, value: "av-61.png" },
        { prop: "userId", type: 8, value: "a7kbetbr_30248538&&7kbetbr" },
        { prop: "username", type: 8, value: "a7kbetbr_30248538" },
      ];
      putDatas( user, userData );

      const configBetOptionsData: TsfsArrItem[] = [
        { type: 4, value: 10 },
        { type: 4, value: 20 },
        { type: 4, value: 50 },
        { type: 4, value: 100 }
      ];
      addDataToArray( configBetOptions, configBetOptionsData );

      const configAutoCashOutData: TsfsItem[] = [
        { prop: "minValue", type: 7, value: 1.01 },
        { prop: "defaultValue", type: 7, value: 1.1 },
        { prop: "maxValue", type: 7, value: 1.00 },
      ];
      putDatas( configAutoCashOut, configAutoCashOutData );

      const configEngagementToolsData: TsfsItem[] = [
        { prop: "isExternalChatEnabled", type: 1, value: false }
      ];
      putDatas( configEngagementTools, configEngagementToolsData );

      const configChatPromoData: TsfsItem[] = [
        { prop: "isExternalChatEnabled", type: 1, value: false }
      ];
      putDatas( configChatPromo, configChatPromoData );

      const configChatRainData: TsfsItem[] = [
        { prop: "isEnabled", type: 1, value: false },
        { prop: "rainMinBet", type: 7, value: 1 },
        { prop: "defaultNumOfUsers", type: 4, value: 5 },
        { prop: "minNumOfUsers", type: 4, value: 3 },
        { prop: "maxNumOfUsers", type: 4, value: 10 },
        { prop: "rainMaxBet", type: 7, value: 50 },
      ];
      putDatas( configChatRain, configChatRainData );

      const configChatData: TsfsItem[] = [
        { prop: "promo", type: 18, value: configChatPromo },
        { prop: "rain", type: 18, value: configChatRain },
        { prop: "isGifsEnabled", type: 1, value: true },
        { prop: "sendMessageDelay", type: 7, value: 5000 },
        { prop: "isEnabled", type: 1, value: false },
        { prop: "maxMessages", type: 4, value: 70 },
        { prop: "maxMessageLength", type: 4, value: 160 },
      ];
      putDatas( configChat, configChatData );

      const configData: TsfsItem[] = [
        { prop: "isAutoBetFeatureEnabled", type: 1, value: true },
        { prop: "betPrecision", type: 4, value: 2 },
        { prop: "maxBet", type: 7, value: 2 },
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
        { prop: "betOptions", type: 17, value: configBetOptions },
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
        { prop: "autoCashOut", type: 18, value: configAutoCashOut },
        { prop: "isMultipleBetsEnabled", type: 1, value: true },
        { prop: "engagementTools", type: 1, value: true },
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
        { prop: "chat", type: 18, value: configChat },
        { prop: "ircDisplayType", type: 8, value: 'modal' },
        { prop: "gameRulesAutoCashOutType", type: 8, value: 'default' }
      ];
      putDatas( config, configData );

      const pData: TsfsItem[] = [
        { prop: "roundsInfo", type: 17, value: roundsInfo },
        { prop: "code", type: 4, value: 200 },
        { prop: "activeBets", type: 17, value: empArr },
        { prop: "onlinePlayers", type: 4, value: 290 },
        { prop: "activeFreeBetsInfo", type: 17, value: empArr },
        { prop: "user", type: 18, value: user },
        { prop: "config", type: 18, value: config },
        { prop: "roundId", type: 4, value: 2537418 },
        { prop: "stageId", type: 4, value: 2 },
        { prop: "currentMultiplier", type: 7, value: 1.59 },
      ];
      putDatas( pObj2, pData );
      
      const parentObj = generateParentObj( "init", pObj2 );
      paramArr.push( parentObj );
    }
  }
  return paramArr;
}

export const generateBetParams = ( param: IBet ) => {
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

export const generateCBParams = ( betId:number, username: string, operator: string ) => {
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

export const generateCashOutParams = ( param: Icoh ) => {
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

export const generateCBIHParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pCashoutArr = new SFS2X.SFSArray();
  const pBetArr = new SFS2X.SFSArray();
  const profiles = [ 'av-26.png', 'av-63.png', 'av-50.png' ];
  const pTopPlayerProfileImages = generateProfileArr( profiles );
 
  const pCashOutItems: TsfsItem[][] = [
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_28066631&&sortenabetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 600 },
      { prop: 'multiplier', type: 7, value: 1.2 },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'currency', type: 8, value: 'BRL' }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 372 },
      { prop: 'multiplier', type: 7, value: 1.24 },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'currency', type: 8, value: 'BRL' }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'winAmount', type: 7, value: 426 },
      { prop: 'multiplier', type: 7, value: 1.42 },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'currency', type: 8, value: 'BRL' }
    ],
    [
      {
        prop: 'player_id',
        type: 8,
        value: 'nash-240992599&&onabetcombr'
      },
      { prop: 'winAmount', type: 7, value: 292 },
      { prop: 'multiplier', type: 7, value: 1.46 },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'currency', type: 8, value: 'BRL' }
    ]
  ];
  pCashOutItems.forEach((item) => {
    const pCashOutItemObj = new SFS2X.SFSObject();
    putDatas( pCashOutItemObj, item );
    pCashoutArr.addSFSObject( pCashOutItemObj );
  })

  const pBetItems: TsfsItem[][] = [
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'verabetbr_2459329&&verabetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-70.png' },
      { prop: 'username', type: 8, value: 'verabetbr_2459329' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'verabetbr_2459329&&verabetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-70.png' },
      { prop: 'username', type: 8, value: 'verabetbr_2459329' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29148305&&betpontobetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-61.png' },
      { prop: 'username', type: 8, value: 'betpontobetbetbr_29148305' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'cassinobetbr_690181&&cassinobetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-29.png' },
      { prop: 'username', type: 8, value: 'cassinobetbr_690181' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'cassinobetbr_690181&&cassinobetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-29.png' },
      { prop: 'username', type: 8, value: 'cassinobetbr_690181' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_28066631&&sortenabetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-39.png' },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_28066631' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_28153046&&sortenabetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-35.png' },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_28153046' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_28153046&&sortenabetbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-35.png' },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_28153046' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'e409825f-a99e-46cb-8123-dd5b64a7194e&&sgdigital_2038'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-34.png' },
      {
        prop: 'username',
        type: 8,
        value: 'e409825f-a99e-46cb-8123-dd5b64a7194e'
      }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'betvipbetbr_183052&&betvipbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-70.png' },
      { prop: 'username', type: 8, value: 'betvipbetbr_183052' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: '2023016907932&&estrelabetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-36.png' },
      { prop: 'username', type: 8, value: 'flamartins87' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'player_id', type: 8, value: 'brxbetbr_823155&&brxbetbr' },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-7.png' },
      { prop: 'username', type: 8, value: 'brxbetbr_823155' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'player_id', type: 8, value: 'brxbetbr_823155&&brxbetbr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-7.png' },
      { prop: 'username', type: 8, value: 'brxbetbr_823155' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: '2022077595277&&estrelabetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-19.png' },
      { prop: 'username', type: 8, value: '69993257387' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_2603&&sortenabetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-4.png' },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_2603' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: 'sortenabetbetbr_2603&&sortenabetbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-4.png' },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_2603' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'player_id', type: 8, value: 'UVVN1M3P4DJ&&rivalocomsa' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-45.png' },
      { prop: 'username', type: 8, value: 'UVVN1M3P4DJ' }
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      {
        prop: 'player_id',
        type: 8,
        value: '2022077595277&&estrelabetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-19.png' },
      { prop: 'username', type: 8, value: '69993257387' }
    ],
    [
      { prop: 'bet', type: 7, value: 499 },
      { prop: 'player_id', type: 8, value: 'a7kbetbr_28565270&&7kbetbr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-38.png' },
      { prop: 'username', type: 8, value: 'a7kbetbr_28565270' }
    ],
    [
      { prop: 'bet', type: 7, value: 499 },
      { prop: 'player_id', type: 8, value: 'a7kbetbr_28565270&&7kbetbr' },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-38.png' },
      { prop: 'username', type: 8, value: 'a7kbetbr_28565270' }
    ],
    [
      { prop: 'bet', type: 7, value: 400 },
      { prop: 'player_id', type: 8, value: '564724088&&betconstructbr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-17.png' },
      { prop: 'username', type: 8, value: '564724088' }
    ],
    [
      { prop: 'bet', type: 7, value: 400 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000006746246&&SoftSwiss_aposta1_prod'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-17.png' },
      { prop: 'username', type: 8, value: 'NuclearJay' }
    ],
    [
      { prop: 'bet', type: 7, value: 400 },
      { prop: 'player_id', type: 8, value: '14s156151478&&tcgbrl' },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-17.png' },
      { prop: 'username', type: 8, value: '82981588986' }
    ],
    [
      { prop: 'bet', type: 7, value: 400 },
      {
        prop: 'player_id',
        type: 8,
        value: 'bullsbetbetbr_28508819&&bullsbetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-26.png' },
      { prop: 'username', type: 8, value: 'bullsbetbetbr_28508819' }
    ],
    [
      { prop: 'bet', type: 7, value: 400 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000006746246&&SoftSwiss_aposta1_prod'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-17.png' },
      { prop: 'username', type: 8, value: 'NuclearJay' }
    ],
    [
      { prop: 'bet', type: 7, value: 378 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000005965730&&SoftSwiss_aposta1_prod'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-62.png' },
      { prop: 'username', type: 8, value: 'HelplessScreamer' }
    ],
    [
      { prop: 'bet', type: 7, value: 375 },
      { prop: 'player_id', type: 8, value: 'a7kbetbr_3006747&&7kbetbr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-61.png' },
      { prop: 'username', type: 8, value: 'a7kbetbr_3006747' }
    ],
    [
      { prop: 'bet', type: 7, value: 350 },
      {
        prop: 'player_id',
        type: 8,
        value: '2022055259664&&estrelabetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-56.png' },
      { prop: 'username', type: 8, value: 'brunopita94' }
    ],
    [
      { prop: 'bet', type: 7, value: 312 },
      { prop: 'player_id', type: 8, value: '14s156151478&&tcgbrl' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-17.png' },
      { prop: 'username', type: 8, value: '82981588986' }
    ],
    [
      { prop: 'bet', type: 7, value: 300 },
      {
        prop: 'player_id',
        type: 8,
        value: 'cassinobetbr_30493113&&cassinobetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-50.png' },
      { prop: 'username', type: 8, value: 'cassinobetbr_30493113' }
    ],
    [
      { prop: 'bet', type: 7, value: 300 },
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-21.png' },
      { prop: 'username', type: 8, value: 'betpontobetbetbr_29230061' }
    ],
    [
      { prop: 'bet', type: 7, value: 300 },
      {
        prop: 'player_id',
        type: 8,
        value: 'betpontobetbetbr_29230061&&betpontobetbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-21.png' },
      { prop: 'username', type: 8, value: 'betpontobetbetbr_29230061' }
    ],
    [
      { prop: 'bet', type: 7, value: 300 },
      {
        prop: 'player_id',
        type: 8,
        value: '67037359-c0da-44b5-a400-7c3bdc72abae&&sgdigital_2038'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-15.png' },
      {
        prop: 'username',
        type: 8,
        value: '67037359-c0da-44b5-a400-7c3bdc72abae'
      }
    ],
    [
      { prop: 'bet', type: 7, value: 250 },
      {
        prop: 'player_id',
        type: 8,
        value: 'apostamaxbetbr_28082742&&apostamaxbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-9.png' },
      { prop: 'username', type: 8, value: 'apostamaxbetbr_28082742' }
    ],
    [
      { prop: 'bet', type: 7, value: 250 },
      { prop: 'player_id', type: 8, value: '640942976&&h2bet' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-72.png' },
      { prop: 'username', type: 8, value: '640942976' }
    ],
    [
      { prop: 'bet', type: 7, value: 240 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000006059696&&SoftSwiss_aposta1_prod'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-50.png' },
      { prop: 'username', type: 8, value: 'LittleNauplius' }
    ],
    [
      { prop: 'bet', type: 7, value: 238 },
      {
        prop: 'player_id',
        type: 8,
        value: 'cassinobetbr_4314041&&cassinobetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-18.png' },
      { prop: 'username', type: 8, value: 'cassinobetbr_4314041' }
    ],
    [
      { prop: 'bet', type: 7, value: 216 },
      {
        prop: 'player_id',
        type: 8,
        value: 'cassinobetbr_4314041&&cassinobetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-18.png' },
      { prop: 'username', type: 8, value: 'cassinobetbr_4314041' }
    ],
    [
      { prop: 'bet', type: 7, value: 203 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000008141650&&SoftSwiss_kingpanda_br'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-41.png' },
      { prop: 'username', type: 8, value: 'Victor' }
    ],
    [
      { prop: 'bet', type: 7, value: 201 },
      {
        prop: 'player_id',
        type: 8,
        value: '4000005993252&&SoftSwiss_aposta1_prod'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-29.png' },
      { prop: 'username', type: 8, value: 'BitterBlackrhino' }
    ],
    [
      { prop: 'bet', type: 7, value: 201 },
      {
        prop: 'player_id',
        type: 8,
        value: 'pj76nvg5e1kmz9vx16fwy3rdx89qlw&&betapp'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-39.png' },
      { prop: 'username', type: 8, value: '119*****516' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      {
        prop: 'player_id',
        type: 8,
        value: 'nash-240992599&&onabetcombr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-51.png' },
      { prop: 'username', type: 8, value: 'sgod6wgf' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      {
        prop: 'player_id',
        type: 8,
        value: 'bullsbetbetbr_28508819&&bullsbetbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-26.png' },
      { prop: 'username', type: 8, value: 'bullsbetbetbr_28508819' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      { prop: 'player_id', type: 8, value: 'nash-74986571&&onabetcombr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-72.png' },
      { prop: 'username', type: 8, value: '11954823755' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      { prop: 'player_id', type: 8, value: 'nash-74986571&&onabetcombr' },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-72.png' },
      { prop: 'username', type: 8, value: '11954823755' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      { prop: 'player_id', type: 8, value: 'a7kbetbr_6009021&&7kbetbr' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-61.png' },
      { prop: 'username', type: 8, value: 'a7kbetbr_6009021' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      {
        prop: 'player_id',
        type: 8,
        value: 'betvipbetbr_183052&&betvipbetbr'
      },
      { prop: 'betId', type: 4, value: 2 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-70.png' },
      { prop: 'username', type: 8, value: 'betvipbetbr_183052' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      { prop: 'player_id', type: 8, value: '457345076&&h2bet' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-8.png' },
      { prop: 'username', type: 8, value: '457345076' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      { prop: 'player_id', type: 8, value: 'nash-1588689264&&luvabet' },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-27.png' },
      { prop: 'username', type: 8, value: 'j7p96mzc' }
    ],
    [
      { prop: 'bet', type: 7, value: 200 },
      {
        prop: 'player_id',
        type: 8,
        value: 'apostamaxbetbr_28082742&&apostamaxbetbr'
      },
      { prop: 'betId', type: 4, value: 1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-9.png' },
      { prop: 'username', type: 8, value: 'apostamaxbetbr_28082742' }
    ]
  ];
  pBetItems.forEach((item) => {
    const pBetItemObj = new SFS2X.SFSObject();
    putDatas( pBetItemObj, item );
    pBetArr.addSFSObject( pBetItemObj );
  })

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

export const generateCSParams = ( roundId: number, state: number ) => {
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

export const generateNewBalanceParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "newBalance", type: 7, value: 22.61 }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "newBalance", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

export const generatePingResponseParams = () => {
  let paramArr: any[] = [];
  const empObj = new SFS2X.SFSObject();
  const parentObj = generateParentObj( "PING_RESPONSE", empObj );
  paramArr.push( parentObj );
  return paramArr;
}

export const generateRCIParams = ( mul: number, roundId: number ) => {
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

export const generateUCCOParams = ( params: IUCCOParams ) => {
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

// c=getHugeWinsInfoHandler
export const generateHWIHParams = () => {
  let paramArr: any[] = [];

  const twArr = new SFS2X.SFSArray();
  const subPObj = new SFS2X.SFSObject();
  const topWinDatas: TsfsItem[][] = [
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 22615.7 },
      { prop: 'endDate', type: 5, value: 1751025861221 },
      { prop: 'payout', type: 7, value: 22615.7 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-60.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175532236 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 4100.4 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 105110785 },
      { prop: 'username', type: 8, value: 'lyciaana120076878' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 20134.7 },
      { prop: 'endDate', type: 5, value: 1751025859901 },
      { prop: 'payout', type: 7, value: 20134.7 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-60.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175532235 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 3650.58 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 105110785 },
      { prop: 'username', type: 8, value: 'lyciaana120076878' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 19723.12 },
      { prop: 'endDate', type: 5, value: 1751025851229 },
      { prop: 'payout', type: 7, value: 9861.56 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-9.png' },
      { prop: 'bet', type: 7, value: 2 },
      { prop: 'roundBetId', type: 5, value: 7175533888 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 3575.95 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 162451769 },
      { prop: 'username', type: 8, value: 'apostatudobetbr_28297178' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 4372.1 },
      { prop: 'endDate', type: 5, value: 1751025841416 },
      { prop: 'payout', type: 7, value: 4372.1 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-60.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175532596 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 792.69 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 128250272 },
      { prop: 'username', type: 8, value: 'neusalima' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 14800.6 },
      { prop: 'winAmount', type: 7, value: 3296.1 },
      { prop: 'endDate', type: 5, value: 1751016430083 },
      { prop: 'payout', type: 7, value: 3297.1 },
      { prop: 'isFreeBet', type: 1, value: true },
      { prop: 'profileImage', type: 8, value: 'av-13.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7174720736 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 597.6 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536232 },
      { prop: 'playerId', type: 4, value: 149224004 },
      { prop: 'username', type: 8, value: 'verabetbr_28049279' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 3216.02 },
      { prop: 'endDate', type: 5, value: 1751025837726 },
      { prop: 'payout', type: 7, value: 3216.02 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-35.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175532215 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 583.09 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 133708487 },
      { prop: 'username', type: 8, value: 'Marcia@99' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 2935.4 },
      { prop: 'endDate', type: 5, value: 1751025836703 },
      { prop: 'payout', type: 7, value: 2935.4 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-10.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175533059 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 532.21 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 136560391 },
      { prop: 'username', type: 8, value: 'cassinobetbr_5723446' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 15152.17 },
      { prop: 'endDate', type: 5, value: 1751025835327 },
      { prop: 'payout', type: 7, value: 2635.16 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-42.png' },
      { prop: 'bet', type: 7, value: 5.75 },
      { prop: 'roundBetId', type: 5, value: 7175533017 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 2747.2 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 134898595 },
      { prop: 'username', type: 8, value: 'marina_gp' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 1053.05 },
      { prop: 'endDate', type: 5, value: 1751024687650 },
      { prop: 'payout', type: 7, value: 2106.11 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-6.png' },
      { prop: 'bet', type: 7, value: 0.5 },
      { prop: 'roundBetId', type: 5, value: 7175424288 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 190.92 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 161845520 },
      { prop: 'username', type: 8, value: 'reisfabrisio7' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 3876.72 },
      { prop: 'endDate', type: 5, value: 1751024686653 },
      { prop: 'payout', type: 7, value: 1938.36 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-32.png' },
      { prop: 'bet', type: 7, value: 2 },
      { prop: 'roundBetId', type: 5, value: 7175425658 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 702.88 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 59748906 },
      { prop: 'username', type: 8, value: 'nobreolenir' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 14800.6 },
      { prop: 'winAmount', type: 7, value: 969.98 },
      { prop: 'endDate', type: 5, value: 1751016420106 },
      { prop: 'payout', type: 7, value: 1437.7 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-7.png' },
      { prop: 'bet', type: 7, value: 0.67 },
      { prop: 'roundBetId', type: 5, value: 7174721139 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 175.86 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536232 },
      { prop: 'playerId', type: 4, value: 179474259 },
      { prop: 'username', type: 8, value: '57-2787254' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 1197.74 },
      { prop: 'endDate', type: 5, value: 1751025825896 },
      { prop: 'payout', type: 7, value: 1197.74 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-64.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175532472 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 217.15 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 173613846 },
      { prop: 'username', type: 8, value: 'jogaobetbr_28024411' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 1178.03 },
      { prop: 'endDate', type: 5, value: 1751024680692 },
      { prop: 'payout', type: 7, value: 1178.03 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-2.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175424740 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 213.58 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 135482736 },
      { prop: 'username', type: 8, value: 'molina12' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 1164.07 },
      { prop: 'winAmount', type: 7, value: 10752.4 },
      { prop: 'endDate', type: 5, value: 1751003973416 },
      { prop: 'payout', type: 7, value: 1075.24 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-13.png' },
      { prop: 'bet', type: 7, value: 10 },
      { prop: 'roundBetId', type: 5, value: 7174118646 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 1949.49 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2535700 },
      { prop: 'playerId', type: 4, value: 91974631 },
      { prop: 'username', type: 8, value: 'erivaldaribeiro7386328' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 14800.6 },
      { prop: 'winAmount', type: 7, value: 21150.6 },
      { prop: 'endDate', type: 5, value: 1751016416334 },
      { prop: 'payout', type: 7, value: 1057.53 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-2.png' },
      { prop: 'bet', type: 7, value: 20 },
      { prop: 'roundBetId', type: 5, value: 7174721065 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 3834.77 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536232 },
      { prop: 'playerId', type: 4, value: 183811053 },
      { prop: 'username', type: 8, value: '498236247' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 1164.07 },
      { prop: 'winAmount', type: 7, value: 2097.58 },
      { prop: 'endDate', type: 5, value: 1751003973129 },
      { prop: 'payout', type: 7, value: 1048.79 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-62.png' },
      { prop: 'bet', type: 7, value: 2 },
      { prop: 'roundBetId', type: 5, value: 7174120084 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 380.3 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2535700 },
      { prop: 'playerId', type: 4, value: 129848671 },
      { prop: 'username', type: 8, value: 'alysonkiller1' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 981.41 },
      { prop: 'endDate', type: 5, value: 1751024678457 },
      { prop: 'payout', type: 7, value: 981.41 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-61.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175425331 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 177.93 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 133676889 },
      { prop: 'username', type: 8, value: 'foskjmr22' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'winAmount', type: 7, value: 1898.74 },
      { prop: 'endDate', type: 5, value: 1751025823090 },
      { prop: 'payout', type: 7, value: 949.37 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-25.png' },
      { prop: 'bet', type: 7, value: 2 },
      { prop: 'roundBetId', type: 5, value: 7175532222 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 344.25 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536631 },
      { prop: 'playerId', type: 4, value: 85357433 },
      { prop: 'username', type: 8, value: 'marciomarques19589299311' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 4556.97 },
      { prop: 'endDate', type: 5, value: 1751024678022 },
      { prop: 'payout', type: 7, value: 949.37 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-72.png' },
      { prop: 'bet', type: 7, value: 4.8 },
      { prop: 'roundBetId', type: 5, value: 7175425395 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 826.21 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 134062086 },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_327836' }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 3477.12 },
      { prop: 'winAmount', type: 7, value: 933.74 },
      { prop: 'endDate', type: 5, value: 1751024677841 },
      { prop: 'payout', type: 7, value: 933.74 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'profileImage', type: 8, value: 'av-60.png' },
      { prop: 'bet', type: 7, value: 1 },
      { prop: 'roundBetId', type: 5, value: 7175424545 },
      { prop: 'winAmountInMainCurrency', type: 7, value: 169.29 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'roundId', type: 4, value: 2536588 },
      { prop: 'playerId', type: 4, value: 128250272 },
      { prop: 'username', type: 8, value: 'neusalima' }
    ]
  ];
  topWinDatas.forEach((item) => {
    const subTopWinObj = new SFS2X.SFSObject();
    putDatas( subTopWinObj, item );
    twArr.addSFSObject( subTopWinObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "topWins", type: 17, value: twArr }
  ];
  putDatas( subPObj, pDatas );

  const parentObj = generateParentObj( "getHugeWinsInfo", subPObj );

  paramArr.push( parentObj );
  return paramArr;
}
// c=getTopRoundsInfoHandler
export const generateGTRIHParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pTopRoundsArr = new SFS2X.SFSArray();

  const topRoundsDatas: TsfsItem[][] = [
    [
      { prop: 'maxMultiplier', type: 7, value: 65618.44 },
      { prop: 'endDate', type: 5, value: 1751025874229 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1751025730128 },
      { prop: 'roundId', type: 4, value: 2536631 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'EC9qbSmSqgNU0UO7kadBU3cXiNP6OPC8PjNOeKB0'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 41348.18 },
      { prop: 'endDate', type: 5, value: 1749481609458 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1749481472742 },
      { prop: 'roundId', type: 4, value: 2472041 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'mVuSZIA5TEpfN8dHqxDFYH5J3TLovFCunAz9dFvd'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 22973.91 },
      { prop: 'endDate', type: 5, value: 1750424751378 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750424618768 },
      { prop: 'roundId', type: 4, value: 2511485 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'EhIh2nhqWpuzgomqYDh3KqvlsRShxM9qisBlkPBY'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 14800.6 },
      { prop: 'endDate', type: 5, value: 1751016448221 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1751016325213 },
      { prop: 'roundId', type: 4, value: 2536232 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'JZfBpDeehL2IFpdb8OVSUKd5WS1NLWDgpTkA5xHp'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 12013 },
      { prop: 'endDate', type: 5, value: 1750751724221 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750751599713 },
      { prop: 'roundId', type: 4, value: 2525017 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'd9jfRmcPneaJr2kja4T645WsoDmTjlmgwAEpi37K'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 11949.4 },
      { prop: 'endDate', type: 5, value: 1750801141727 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750801020896 },
      { prop: 'roundId', type: 4, value: 2527108 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'Ri0Lt2lBuyh8wCcJfUlbmQcVHEQjxsRsN9xEYgxt'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 11433.51 },
      { prop: 'endDate', type: 5, value: 1749781008582 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1749780889168 },
      { prop: 'roundId', type: 4, value: 2484616 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'ds6jMkANjaH3V6xaucQTW0wMQrjd0QBAFHKWH97u'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 9974.09 },
      { prop: 'endDate', type: 5, value: 1750410003784 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750409882868 },
      { prop: 'roundId', type: 4, value: 2510850 },
      {
        prop: 'serverSeed',
        type: 8,
        value: '4EdBTqgFqOvTinnad2oh0JV6VoFMOUAwRL4Js1Rm'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 9738.51 },
      { prop: 'endDate', type: 5, value: 1750145967576 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750145848868 },
      { prop: 'roundId', type: 4, value: 2499940 },
      {
        prop: 'serverSeed',
        type: 8,
        value: '5Mk4oMyulWkjezBD0RcjberyTpOfmKSJHNIjWTZ6'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 8795.35 },
      { prop: 'endDate', type: 5, value: 1748906869364 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1748906751941 },
      { prop: 'roundId', type: 4, value: 2448700 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'XvTXlDmXQFtpXDO8vYPpZgfT4EQFow45kI7CdvPg'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 8157.87 },
      { prop: 'endDate', type: 5, value: 1749092237767 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1749092120441 },
      { prop: 'roundId', type: 4, value: 2456293 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'ZRpTznwSfUfKPiMzf3FnrGzRcdqWz7ANPsrMGh25'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 7529.33 },
      { prop: 'endDate', type: 5, value: 1749888669480 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1749888555168 },
      { prop: 'roundId', type: 4, value: 2489108 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'fwlQ5Gokw19dv55nr7Onto9HVjrrmGQ1FE8N4X5A'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 7453.12 },
      { prop: 'endDate', type: 5, value: 1750222229284 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750222114169 },
      { prop: 'roundId', type: 4, value: 2502940 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'gfNXXEDz3rXrmijKesGhyh64EH0wjEOYs1AeK49y'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 6485.75 },
      { prop: 'endDate', type: 5, value: 1750217596188 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750217479068 },
      { prop: 'roundId', type: 4, value: 2502765 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'ANZwav2EouvE7LKbc3VzB115sVrh1JSnzZNvYcDJ'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 6410.08 },
      { prop: 'endDate', type: 5, value: 1750157047079 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750156933668 },
      { prop: 'roundId', type: 4, value: 2500407 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'uwZbm39W10RVlGuz6WKxn3P7wscYW7BmnuvcUzZ6'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 6063.42 },
      { prop: 'endDate', type: 5, value: 1748969242456 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1748969130242 },
      { prop: 'roundId', type: 4, value: 2451329 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'EaBOsRcVTBPmDdj4XrtDs9UuwD6XwOy1Qalq4hB0'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 6016.08 },
      { prop: 'endDate', type: 5, value: 1750804127228 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750804013699 },
      { prop: 'roundId', type: 4, value: 2527227 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'pBLsYVmei273ZBWl7ucWe5iizhrWqqarj6RdToz8'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 5703.22 },
      { prop: 'endDate', type: 5, value: 1748837704196 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1748837593386 },
      { prop: 'roundId', type: 4, value: 2445833 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'LxCZDxWbAvDjTqHIubJpTdm5cUF6xXg6PfqDTII4'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 5235.21 },
      { prop: 'endDate', type: 5, value: 1750103119483 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750103007068 },
      { prop: 'roundId', type: 4, value: 2498221 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'QylmFKFD1YGCDqoZnauAubeo6KqSMhePGTb5PYwy'
      }
    ],
    [
      { prop: 'maxMultiplier', type: 7, value: 5133.41 },
      { prop: 'endDate', type: 5, value: 1750118268700 },
      { prop: 'zone', type: 8, value: 'aviator_core_inst4_sa' },
      { prop: 'roundStartDate', type: 5, value: 1750118156268 },
      { prop: 'roundId', type: 4, value: 2498854 },
      {
        prop: 'serverSeed',
        type: 8,
        value: 'ZMM8D9JDramuD5ejtGjGpVKmtjQm478gALBPs1jz'
      }
    ]
  ];

  topRoundsDatas.forEach((subData) => {
    const subTopRoundsObj = new SFS2X.SFSObject();
    putDatas( subTopRoundsObj, subData );
    pTopRoundsArr.addSFSObject( subTopRoundsObj );
  })

  const pDatas: TsfsItem[] = [
    { prop: "code", type: 4, value: 200 },
    { prop: "topRounds", type: 17, value: pTopRoundsArr }
  ];
  putDatas( pObj, pDatas );

  const parentObj = generateParentObj( "PING_RESPONSE", pObj );
  paramArr.push( parentObj );
  return paramArr;
}

// c=previousRoundInfoResponse
export const generatePRIRParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  const pBetsArr = new SFS2X.SFSArray();
  const pRoundInfoObj = new SFS2X.SFSObject();

  const pRoundInfoDatas: TsfsItem[] = [
    { prop: "multiplier", type: 7, value: 1 },
    { prop: "roundStartDate", type: 5, value: 1751044571775 },
    { prop: "roundEndDate", type: 5, value: 1751044580447 },
    { prop: "roundId", type: 4, value: 2537419 }
  ];
  putDatas( pRoundInfoObj, pRoundInfoDatas );

  const pBetsDatas: TsfsItem[][] = [
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'roundBetId', type: 5, value: 7178229102 },
      { prop: 'winAmount', type: 7, value: 0 },
      { prop: 'payout', type: 7, value: 0 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-35.png' },
      { prop: 'win', type: 1, value: false },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_28153046' }  
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'roundBetId', type: 5, value: 7178229103 },
      { prop: 'winAmount', type: 7, value: 0 },
      { prop: 'payout', type: 7, value: 0 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-35.png' },
      { prop: 'win', type: 1, value: false },
      { prop: 'username', type: 8, value: 'sortenabetbetbr_28153046' }  
    ],
    [
      { prop: 'bet', type: 7, value: 500 },
      { prop: 'roundBetId', type: 5, value: 7178229094 },
      // { prop: 'winAmount', type: 7, value: 0 },
      { prop: 'winAmount', type: 7, value: 600 },
      { prop: 'payout', type: 7, value: 1.2 },
      // { prop: 'payout', type: 7, value: 0 },
      { prop: 'isFreeBet', type: 1, value: false },
      { prop: 'currency', type: 8, value: 'BRL' },
      { prop: 'profileImage', type: 8, value: 'av-70.png' },
      { prop: 'win', type: 1, value: true },
      // { prop: 'win', type: 1, value: false },
      { prop: 'username', type: 8, value: 'verabetbr_2459329' }
    ]
  ];
  pBetsDatas.forEach((betData) => {
    const subBetObj = new SFS2X.SFSObject();
    putDatas( subBetObj, betData );
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

// c = setPlayerSettingResponse
export const generateSPSRParams = () => {
  let paramArr: any[] = [];
  const pObj = new SFS2X.SFSObject();
  pObj.putInt( "code", 200 );

  const parentObj = generateParentObj( "setPlayerSettingResponse", pObj );
  paramArr.push( parentObj );
  return paramArr;
}
// c = x
export const generateXParams = ( cFlag: boolean, x: number ) => {
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

export const generateParamDataByMsg = ( sParams: IStaticMsgParam ) => {
  let paramArr: any[] = [];
  switch ( sParams._aid ) {
    case 13:
      const pObj13 = new SFS2X.SFSObject();
      switch ( sParams.controller ) {
        case "onlinePlayers":
          const opObj = new SFS2X.SFSObject();
          const opDatas: TsfsItem[] = [
            { prop: "code", type: 4, value: 200 },
            { prop: sParams.controller, type: 5, value: 277 }
          ];
          putDatas( opObj, opDatas );

          const pOPData: TsfsItem[] = [
            { prop: "p", type: 18, value: opObj },
            { prop: "c", type: 8, value: sParams.controller }
          ];
          putDatas( pObj13, pOPData );

          paramArr.push( pObj13 );
          break;
      }
      break;
  }

  return paramArr;
}
