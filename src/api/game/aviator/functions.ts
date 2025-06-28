const SFS2X = require("sfs2x-api");

type TsfsArrItem = {
  type: number
  value: boolean | number | string | any[]
}

type TsfsItem = {
  prop: string
  type: number
  value: number | string | any[]
}

const putDatas = ( tObj: any, src: TsfsItem[] ) => {
  src.forEach((item) => {
    switch (item.type) {
      case 3 :
        tObj.putShort( item.prop, item.value );
        break;
      case 4 :
        tObj.putInt( item.prop, item.value );
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
    }
  })
}

const addDataToArray = ( tArr: any, src: TsfsItem[] | TsfsArrItem[] ) => {
  // console.log(`src is `, src);
  src.forEach((item) => {
    // console.log(`item =`, item);
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

export const analyzeMsg = ( action: number, paramInfo: any  ) => {
  const data: any = {};
  switch (action) {
    case 1:
    case 13:
        const p = paramInfo._dataHolder.get("p").value._dataHolder;
        data.p = p;
        // console.log(` ===> p =`, p);
        if( action===13 ) {
            const c = paramInfo._dataHolder.get("c").value;
            data.c = c;
            // console.log(` ===> c =`, c);
        }
        break;
  }
  return data;
}

export const generateResp = ( action: number, controller: string ) => {
  let paramArr: any[] = [];
  switch ( action ) {
    case 1 : // state
      for( let i=0; i<2; i++ ) {
        const msgData = new SFS2X.SFSObject();
        const empArr = new SFS2X.SFSArray();
        if( i==0 ) {
          const rlArr = new SFS2X.SFSArray();
          const rlParentArr = new SFS2X.SFSArray();
          rlArr.addInt( 0 ); // 4
          rlArr.addUtfString("game_state"); // 8
          rlArr.addUtfString("default");
          rlArr.addBool(false); // 1
          rlArr.addBool(false);
          rlArr.addBool(false);
          rlArr.addShort( 0 ); // 3
          rlArr.addShort( 20 );
          rlArr.addSFSArray( empArr );
          rlParentArr.addSFSArray( rlArr );
          // console.log("Array size:", rlArr.size()); // Output: 2
          // console.log("Array dump:", rlArr.getDump()); // Should show both 0 and 5

          msgData.putShort( "rs", 0 );
          msgData.putUtfString( "zn", "aviator_core_inst4_sa" );
          msgData.putUtfString( "un", "a7kbetbr_30248538&&7kbetbr" );
          msgData.putShort( "pi", 0 );
          msgData.putSFSArray( "rl", rlParentArr );
          msgData.putInt( "id", 761508 );
        } else if( i===1 ) {
          const muls = [ 7.32, 5.38, 2.49, 9.31, 1.35, 1.27, 1.07, 4.69, 1.15, 2.85, 1.29, 1.06, 4.82, 1.08, 1.57, 11.23, 1.01, 35.65, 3.6, 1.62, 1.51, 14.54, 1.8, 1.3, 15.88 ];
          const rid = 2528153;
          // const pArr = new SFS2X.SFSArray();
          const pObj = new SFS2X.SFSObject();
          const roundsInfo = new SFS2X.SFSArray();

          for (let i = 0; i < muls.length; i++) {
            const roundObj = new SFS2X.SFSObject();
            roundObj.putDouble( "maxMultiplier", muls[ i ] );
            roundObj.putInt( "roundId", rid-i );
            roundsInfo.addSFSObject( roundObj );
          }

          const userSettings = new SFS2X.SFSObject();
          userSettings.putBool( "music", true );
          userSettings.putBool( "sound", true );
          userSettings.putBool( "secondBet", true );
          userSettings.putBool( "animation", true );
          
          const user = new SFS2X.SFSObject();
          user.putSFSObject( "settings", userSettings );
          user.putDouble( "balance", 19.95 );
          user.putUtfString( "profileImage", "av-61.png" );
          user.putUtfString( "userId", "a7kbetbr_30248538&&7kbetbr" );
          user.putUtfString( "username", "a7kbetbr_30248538" );
          
          const config = new SFS2X.SFSObject();
          const configBetOptions = new SFS2X.SFSArray();
          configBetOptions.addDouble( 10 );
          configBetOptions.addDouble( 20 );
          configBetOptions.addDouble( 50 );
          configBetOptions.addDouble( 100 );
          const configAutoCashOut = new SFS2X.SFSObject();
          configAutoCashOut.putDouble( "minValue", 1.01 );
          configAutoCashOut.putDouble( "defaultValue", 1.1 );
          configAutoCashOut.putDouble( "maxValue", 100 );
          const configEngagementTools = new SFS2X.SFSObject();
          configEngagementTools.putBool( "isExternalChatEnabled", false );
          const configChat = new SFS2X.SFSObject();
          const configChatPromo = new SFS2X.SFSObject();
          configChatPromo.putBool( "isEnabled", true );
          const configChatRain = new SFS2X.SFSObject();
          configChatRain.putBool( "isEnabled", false );
          configChatRain.putDouble( "rainMinBet", 1 );
          configChatRain.putInt( "defaultNumOfUsers", 5 );
          configChatRain.putInt( "minNumOfUsers", 3 );
          configChatRain.putInt( "maxNumOfUsers", 10 );
          configChatRain.putDouble( "rainMaxBet", 50 );

          configChat.putSFSObject( "promo", configChatPromo );
          configChat.putSFSObject( "rain", configChatRain );
          configChat.putBool( "isGifsEnabled", true );
          configChat.putDouble( "sendMessageDelay", 5000 );
          configChat.putBool( "isEnabled", false );
          configChat.putInt( "maxMessages", 70 );
          configChat.putInt( "maxMessageLength", 160 );

          config.putBool( "isAutoBetFeatureEnabled", true );
          config.putInt( "betPrecision", 2 );
          config.putDouble( "maxBet", 500 );
          config.putBool( "isAlderneyModalShownOnInit", false );
          config.putBool( "isCurrencyNameHidden", false );
          config.putBool( "isLoginTimer", false );
          config.putBool( "isClockVisible", false );
          config.putBool( "isBetsHistoryEndBalanceEnabled", false );
          config.putDouble( "betInputStep", 1 );
          config.putBool( "isGameRulesHaveMaxWin", false );
          config.putBool( "isBetsHistoryStartBalanceEnabled", false );
          config.putBool( "isMaxUserMultiplierEnabled", false );
          config.putBool( "isShowActivePlayersWidget", true );
          config.putUtfString( "backToHomeActionType", "navigate" );
          config.putInt( "inactivityTimeForDisconnect", 0 );
          config.putBool( "isActiveGameFocused", false );
          config.putBool( "isNetSessionEnabled", false );
          config.putInt( "fullBetTime", 5000 );
          config.putDouble( "minBet", 1 );
          config.putBool( "isGameRulesHaveMinimumBankValue", false );
          config.putBool( "isShowTotalWinWidget", true );
          config.putBool( "isShowBetControlNumber", false );
          config.putSFSArray( "betOptions", configBetOptions );
          config.putUtfString( "modalShownOnInit", "none" );
          config.putBool( "isLiveBetsAndStatisticsHidden", false );
          config.putUtfString( "onLockUIActions", "cancelBet" );
          config.putBool( "isEmbeddedVideoHidden", false );
          config.putBool( "isBetTimerBranded", true );
          config.putDouble( "defaultBetValue", 1 );
          config.putDouble( "maxUserWin", 50000 );
          config.putBool( "isUseMaskedUsername", true );
          config.putBool( "isShowWinAmountUntilNextRound", false );
          config.putInt( "multiplierPrecision", 2 );
          config.putSFSObject( "autoCashOut", configAutoCashOut );
          config.putBool( "isMultipleBetsEnabled", true );
          config.putSFSObject( "engagementTools", configEngagementTools );
          config.putBool( "isFreeBetsEnabled", true );
          config.putInt( "pingIntervalMs", 15000 );
          config.putBool( "isLogoUrlHidden", false );
          config.putInt( "chatApiVersion", 2 );
          config.putUtfString( "currency", "BRL" );
          config.putBool( "showCrashExampleInRules", false );
          config.putBool( "isPodSelectAvailable", false );
          config.putBool( "isBalanceValidationEnabled", true );
          config.putBool( "isHolidayTheme", false );
          config.putBool( "isGameRulesHaveMultiplierFormula", false );
          config.putUtfString( "accountHistoryActionType", "navigate" );
          config.putSFSObject( "chat", configChat );
          config.putUtfString( "ircDisplayType", "modal" );
          config.putUtfString( "gameRulesAutoCashOutType", "default" );

          pObj.putSFSArray( "roundsInfo", roundsInfo );
          pObj.putInt( "code", 200 );
          pObj.putInt( "fullBetTime", 5000 );
          pObj.putSFSArray( "activeBets", empArr );
          // /*
          pObj.putSFSArray( "activeFreeBetsInfo", empArr );
          pObj.putInt( "betTimeLeft", 3245 );
          pObj.putInt( "onlinePlayers", 161 );
          pObj.putLong( "betStateEndTime", 1750826071712 );
          pObj.putLong( "serverTime", 1750826068467 );
          // */
          pObj.putSFSObject( "user", user );
          pObj.putSFSObject( "config", config );
          pObj.putInt( "roundId", 2528154 );
          pObj.putInt( "stageId", 1 );

          msgData.putSFSObject( "p", pObj );
          msgData.putUtfString( "c", "init" );
        }
        paramArr.push( msgData );
      }
      break;
    case 13 :
      const obj13 = new SFS2X.SFSObject();
      const pObj = new SFS2X.SFSObject();
      if( controller==="currentBetsInfoHandler" ) {
        pObj.putInt( "betsCount", 444 );
        pObj.putInt( "code", 200 );
        pObj.putInt( "activePlayersCount", 340 );
        const pBetArr = new SFS2X.SFSArray();
        const pBetInfo = [
          {
            bet: 500,
            player_id: 'a7kbetbr_5225886&&7kbetbr',
            betId: 2,
            profileImage: 'av-48.png',
            username: 'a7kbetbr_5225886'
          },
          {
            bet: 500,
            player_id: 'apostatudobetbr_28324213&&apostatudobetbr',
            betId: 1,
            profileImage: 'av-50.png',
            username: 'apostatudobetbr_28324213'
          },
          {
            bet: 152.25,
            player_id: '909358&&bettomaxlbrcom_sa',
            betId: 1,
            profileImage: 'av-38.png',
            username: '0887599886'
          },
          {
            bet: 150,
            player_id: 'sortenabetbetbr_28457274&&sortenabetbetbr',
            betId: 1,
            profileImage: 'av-64.png',
            username: 'sortenabetbetbr_28457274'
          },
          {
            bet: 144,
            player_id: '0ze96521889&&tcgs2brl',
            betId: 1,
            profileImage: 'av-1.png',
            username: 'leonardo36852'
          },
          {
            bet: 125,
            player_id: 'nash-1757574384&&realsbetcombr',
            betId: 1,
            profileImage: 'av-70.png',
            username: 'i63pqciq'
          },
          {
            bet: 100,
            player_id: 'sortenabetbetbr_28515577&&sortenabetbetbr',
            betId: 1,
            profileImage: 'av-51.png',
            username: 'sortenabetbetbr_28515577'
          },
          {
            bet: 100,
            player_id: '0xb91420130&&tcgs2brl',
            betId: 2,
            profileImage: 'av-20.png',
            username: 'cicerosimcero'
          },
          {
            bet: 100,
            player_id: '0xb91420130&&tcgs2brl',
            betId: 1,
            profileImage: 'av-20.png',
            username: 'cicerosimcero'
          },
          {
            bet: 100,
            player_id: 'brxbetbr_3910889&&brxbetbr',
            betId: 1,
            profileImage: 'av-30.png',
            username: 'brxbetbr_3910889'
          },
          {
            bet: 76,
            player_id: '250911712268156&&estrelabetbr',
            betId: 2,
            profileImage: 'av-54.png',
            username: 'Santana0191'
          },
          {
            bet: 75,
            player_id: 'sortenabetbetbr_28541110&&sortenabetbetbr',
            betId: 1,
            profileImage: 'av-60.png',
            username: 'sortenabetbetbr_28541110'
          },
          {
            bet: 70,
            player_id: '250911712268156&&estrelabetbr',
            betId: 1,
            profileImage: 'av-54.png',
            username: 'Santana0191'
          },
          {
            bet: 60,
            player_id: '35478667&&lotogreencom',
            betId: 1,
            profileImage: 'av-29.png',
            username: 'PEDRO'
          },
          {
            bet: 50,
            player_id: '92d5598d-6e83-4516-a6e0-1fb046a60352&&sgdigital_2038',
            betId: 1,
            profileImage: 'av-15.png',
            username: '92d5598d-6e83-4516-a6e0-1fb046a60352'
          },
          {
            bet: 50,
            player_id: 'sortenabetbetbr_28515577&&sortenabetbetbr',
            betId: 2,
            profileImage: 'av-51.png',
            username: 'sortenabetbetbr_28515577'
          },
          {
            bet: 50,
            player_id: 'cassinobetbr_30144381&&cassinobetbr',
            betId: 1,
            profileImage: 'av-56.png',
            username: 'cassinobetbr_30144381'
          },
          {
            bet: 50,
            player_id: 'cassinobetbr_7143128&&cassinobetbr',
            betId: 1,
            profileImage: 'av-21.png',
            username: 'cassinobetbr_7143128'
          },
          {
            bet: 50,
            player_id: 'cassinobetbr_7143128&&cassinobetbr',
            betId: 2,
            profileImage: 'av-21.png',
            username: 'cassinobetbr_7143128'
          },
          {
            bet: 50,
            player_id: '565630709&&betconstructbr',
            betId: 1,
            profileImage: 'av-16.png',
            username: '565630709'
          },
          {
            bet: 50,
            player_id: '565630709&&betconstructbr',
            betId: 2,
            profileImage: 'av-16.png',
            username: '565630709'
          },
          {
            bet: 50,
            player_id: '6036_991417&&aguiaprime119000',
            betId: 2,
            profileImage: 'av-35.png',
            username: '6036_991417'
          },
          {
            bet: 50,
            player_id: 'sortenabetbetbr_28253172&&sortenabetbetbr',
            betId: 2,
            profileImage: 'av-32.png',
            username: 'sortenabetbetbr_28253172'
          },
          {
            bet: 50,
            player_id: 'verabetbr_28849136&&verabetbr',
            betId: 1,
            profileImage: 'av-44.png',
            username: 'verabetbr_28849136'
          },
          {
            bet: 50,
            player_id: '2022077661182&&estrelabetbr',
            betId: 1,
            profileImage: 'av-1.png',
            username: '2501fabiano'
          },
          {
            bet: 48,
            player_id: '2022088690336&&estrelabetbr',
            betId: 1,
            profileImage: 'av-21.png',
            username: 'takeshita123'
          },
          {
            bet: 44,
            player_id: 'nash-2101527954&&realsbetcombr',
            betId: 1,
            profileImage: 'av-53.png',
            username: 'yhhvdp3a'
          },
          {
            bet: 40,
            player_id: '2022106467465&&estrelabetbr',
            betId: 1,
            profileImage: 'av-2.png',
            username: 'filipereira'
          },
          {
            bet: 40,
            player_id: 'sortenabetbetbr_259470&&sortenabetbetbr',
            betId: 1,
            profileImage: 'av-41.png',
            username: 'sortenabetbetbr_259470'
          },
          {
            bet: 36,
            player_id: '2022077115046&&estrelabetbr',
            betId: 1,
            profileImage: 'av-14.png',
            username: 'weudessouza'
          },
          {
            bet: 30,
            player_id: '0xb153393142&&tcgs2brl',
            betId: 1,
            profileImage: 'av-65.png',
            username: 'paulinho2525'
          },
          {
            bet: 30,
            player_id: '454240575&&seubet',
            betId: 1,
            profileImage: 'av-15.png',
            username: '454240575'
          },
          {
            bet: 30,
            player_id: '1816327a-7f87-40fd-b164-3fa75004f70c&&sgdigital_2038',
            betId: 1,
            profileImage: 'av-59.png',
            username: '1816327a-7f87-40fd-b164-3fa75004f70c'
          },
          {
            bet: 28,
            player_id: '41775037&&br4betcom',
            betId: 1,
            profileImage: 'av-71.png',
            username: 'LEONARDO'
          },
          {
            bet: 28,
            player_id: '41775037&&br4betcom',
            betId: 2,
            profileImage: 'av-71.png',
            username: 'LEONARDO'
          },
          {
            bet: 26.98,
            player_id: 'FTC1VGH6DCW&&rivalocosa',
            betId: 1,
            profileImage: 'av-67.png',
            username: 'FTC1VGH6DCW'
          },
          {
            bet: 25,
            player_id: 'apostamaxbetbr_28002063&&apostamaxbetbr',
            betId: 2,
            profileImage: 'av-21.png',
            username: 'apostamaxbetbr_28002063'
          },
          {
            bet: 25,
            player_id: '4809_7e4416116443380e6b3103d9f18e6BRL&&doubleent',
            betId: 2,
            profileImage: 'av-31.png',
            username: '4809_7e4416116443380e6b3103d9f18e6BRL'
          },
          {
            bet: 25,
            player_id: '566332388&&betconstructbr',
            betId: 1,
            profileImage: 'av-12.png',
            username: '566332388'
          },
          {
            bet: 25,
            player_id: 'a7kbetbr_28397843&&7kbetbr',
            betId: 1,
            profileImage: 'av-72.png',
            username: 'a7kbetbr_28397843'
          },
          {
            bet: 25,
            player_id: 'nash-1252792642&&realsbetcombr',
            betId: 1,
            profileImage: 'av-6.png',
            username: 'rclacsd0'
          },
          {
            bet: 24.16,
            player_id: 'aviator__ATP__2__1000409266__spribe_aviator&&apuestatotalprod',  
            betId: 1,
            profileImage: 'av-52.png',
            username: 'rafi.pili26@gmail.com'
          },
          {
            bet: 24,
            player_id: 'cassinobetbr_6954552&&cassinobetbr',
            betId: 2,
            profileImage: 'av-43.png',
            username: 'cassinobetbr_6954552'
          },
          {
            bet: 23.61,
            player_id: '33594461&&lotogreencom',
            betId: 1,
            profileImage: 'av-28.png',
            username: 'Jose'
          },
          {
            bet: 23,
            player_id: '567784916&&betconstructbr',
            betId: 2,
            profileImage: 'av-55.png',
            username: '567784916'
          },
          {
            bet: 23,
            player_id: '2022099864835&&estrelabetbr',
            betId: 1,
            profileImage: 'av-4.png',
            username: 'alexandrexj6'
          },
          {
            bet: 23,
            player_id: 'cassinobetbr_30507864&&cassinobetbr',
            betId: 1,
            profileImage: 'av-31.png',
            username: 'cassinobetbr_30507864'
          },
          {
            bet: 22,
            player_id: '4000007989150&&SoftSwiss_bichonopix_latam',
            betId: 1,
            profileImage: 'av-30.png',
            username: 'Mateus Cabral Morais'
          },
          {
            bet: 20.99,
            player_id: '585296ad-eede-46b8-8d35-45bb6bcfdfb1&&sgdigital_2038',
            betId: 1,
            profileImage: 'av-16.png',
            username: '585296ad-eede-46b8-8d35-45bb6bcfdfb1'
          },
          {
            bet: 20,
            player_id: '92d5598d-6e83-4516-a6e0-1fb046a60352&&sgdigital_2038',
            betId: 2,
            profileImage: 'av-15.png',
            username: '92d5598d-6e83-4516-a6e0-1fb046a60352'
          }
        ];
        pBetInfo.forEach((item) => {
          const pBetObj = new SFS2X.SFSObject();
          pBetObj.putDouble( "bet", item.bet );
          pBetObj.putUtfString( "player_id", item.player_id );
          pBetObj.putInt( "betId", item.betId );
          pBetObj.putBool( "isFreeBet", false );
          pBetObj.putUtfString( "currency", "BRL" );
          pBetObj.putUtfString( "profileImage", item.profileImage );
          pBetObj.putUtfString( "username", item.username );
          pBetArr.addSFSObject( pBetObj );
        })

        const pTopPlayerProfileImages = new SFS2X.SFSArray();
        pTopPlayerProfileImages.addUtfString( "av-67.png" );
        pTopPlayerProfileImages.addUtfString( "av-2.png" );
        pTopPlayerProfileImages.addUtfString( "av-57.png" );

        pObj.putSFSArray( "bets", pBetArr );
        pObj.putSFSArray( "topPlayerProfileImages", pTopPlayerProfileImages );
        
        obj13.putSFSObject( "p", pObj );
        obj13.putUtfString( "c", "updateCurrentBets" );
      } else if( controller==="PING_REQUEST" ) {
        pObj.putInt( "code", 200 );
        pObj.putDouble( "x", 1.92 );
        obj13.putSFSObject( "p", pObj );
        obj13.putUtfString( "c", "x" );
      } else {
        pObj.putInt( "newStateId", 1 );
        pObj.putInt( "code", 200 );
        pObj.putInt( "roundId", 2509641 );
        pObj.putInt( "timeLeft", 5000 );
        obj13.putSFSObject( "p", pObj );
        obj13.putUtfString( "c", "changeState" );
      }
      paramArr.push( obj13 );
      break;
  }

  return paramArr ;
}

export const generateParamDataByMsg = ( _aid: number, _cid: number ) => {
  let paramArr: any[] = [];
  const empArr = new SFS2X.SFSArray();
  
  if( _aid===0 && _cid===0 ) {
    const pObj0 = new SFS2X.SFSObject();
    const data0: TsfsItem[] = [
      { prop: "ct", type: 4, value: 1024 },
      { prop: "ms", type: 4, value: 500000 },
      { prop: "tk", type: 8, value: "32a20f2bc3a0ee4dc33c88eecf0cd752" },
    ];
    putDatas( pObj0, data0 );
    paramArr.push( pObj0 );
  } else if( _aid===1 && _cid===0 ) {
    for (let i = 0; i < 2; i++) {
      const pObj1 = new SFS2X.SFSObject();
      if( i===0 ) {
        const rlArr = new SFS2X.SFSArray();
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
        const data0: TsfsItem[] = [
          { prop: "rs", type: 3, value: 0 },
          { prop: "zn", type: 8, value: 'aviator_core_inst4_sa' },
          { prop: "un", type: 8, value: 'a7kbetbr_30248538&&7kbetbr' },
          { prop: "pi", type: 3, value: 0 },
          { prop: "rl", type: 17, value: rlArr },
          { prop: "id", type: 4, value: 3212110 }
        ];
        putDatas( pObj1, data0 );
      } else {
        const data1: TsfsItem[] = [

        ];
      }
      paramArr.push( pObj1 );
    }
  }

  return paramArr;
}

export const generateGameStateMsg = ( controller: string ) => {
  const msgArr: any[] = [];
  const gameStateObj = new SFS2X.SFSObject();
  const pObj = new SFS2X.SFSObject();
  const empArr = new SFS2X.SFSArray();
  switch (controller) {
    case "changeState":
      const stateDatas: TsfsItem[] = [
        { prop: "newStateId", type: 4, value: 2 },
        { prop: "code", type: 4, value: 200 },
        { prop: "roundId", type: 4, value: 2509641 }
      ];
      putDatas( pObj, stateDatas );
      break;
    case "onlinePlayers":
      const playerDatas: TsfsItem[] = [
        { prop: "code", type: 4, value: 200 },
        { prop: "onlinePlayers", type: 5, value: 359 }
      ];
      putDatas( pObj, playerDatas );
      break;
    case "updateCurrentBets":
      const currentBetDatas: TsfsItem[] = [
        { prop: "betsCount", type: 4, value: 0 },
        { prop: "code", type: 4, value: 200 },
        { prop: "activePlayersCount", type: 4, value: 0 },
        { prop: "bets", type: 17, value: empArr },
        { prop: "topPlayerProfileImages", type: 17, value: empArr },
      ];
      putDatas( pObj, currentBetDatas );
      break;
    case "updateCurrentCashOuts":
      const pTopPlayerProfileImageArr = new SFS2X.SFSArray();
      const pCashOutsArr = new SFS2X.SFSArray();

      const topPlayerImagesData: TsfsItem[] = [
        { prop: "", type: 8, value: "av-72.png" },
        { prop: "", type: 8, value: "av-53.png" },
        { prop: "", type: 8, value: "av-61.png" }
      ];
      addDataToArray( pTopPlayerProfileImageArr, topPlayerImagesData );
      
      const _cashOutData: TsfsItem[][] = [
        [ 
          { prop: "player_id", type: 8, value: 'nash-1811049230&&realsbetcombr' },
          { prop: "winAmount", type: 7, value: 390 },
          { prop: "multiplier", type: 7, value: 1.3 },
          { prop: "betId", type: 4, value: 1 },
        ]
      ];
      
      _cashOutData.forEach((item) => {
        const subData = new SFS2X.SFSObject();
        putDatas( subData, item );
        pCashOutsArr.addSFSObject( subData );
      })
      
      const cashOutDatas: TsfsItem[] = [
        { prop: "openBetsCount", type: 4, value: 4092 },
        { prop: "code", type: 4, value: 200 },
        { prop: "cashouts", type: 17, value: pCashOutsArr },
        { prop: "activePlayersCount", type: 4, value: 2406 },
        { prop: "totalCashOut", type: 4, value: 390 },
        { prop: "topPlayerProfileImages", type: 17, value: pTopPlayerProfileImageArr },
      ];
      putDatas( pObj, cashOutDatas );
      break;
    case "x":
      const xDatas: TsfsItem[] = [
        { prop: "code", type: 4, value: 200 },
        { prop: "x", type: 7, value: 1 }
      ];
      putDatas( pObj, xDatas );
      break;
  }
  gameStateObj.putSFSObject( "p", pObj );
  gameStateObj.putUtfString( "c", controller );
  return gameStateObj;
}