const SFS2X = require("sfs2x-api");

export const analyzeMsg = ( action: number, paramInfo: any  ) => {
  const data: any = {};
  switch (action) {
    case 1:
    case 13:
        const p = paramInfo._dataHolder.get("p").value._dataHolder;
        data.p = p;
        console.log(` ===> p =`, p);
        if( action===13 ) {
            const c = paramInfo._dataHolder.get("c").value;
            data.c = c;
            console.log(` ===> c =`, c);
        }
        break;
  }
  return data;
}

export const generateResp = ( action: number ) => {
  let paramArr: any[] = [];
  switch ( action ) {
    case 0 : // init
      const obj0 = new SFS2X.SFSObject;
      obj0.putInt( "ct", 1024 );
      obj0.putInt( "ms", 500000 );
      obj0.putUtfString( "tk", "aad5fdc496e117bec48db98bac805757" );
      paramArr.push( obj0 );
      break;
    case 1 : // state
      for( let i=0; i<2; i++ ) {
        const msgData = new SFS2X.SFSObject();
        const empArr = new SFS2X.SFSArray();
        if( i==0 ) {
          const rlArr = new SFS2X.SFSArray();
          const rlParentArr = new SFS2X.SFSArray();
          const rlSubObj = new SFS2X.SFSObject();
          rlArr.addInt( 0 ); // 4
          rlArr.addUtfString("game_state"); // 8
          rlArr.addUtfString("default");
          rlArr.addBool(false); // 1
          rlArr.addBool(false);
          rlArr.addBool(false);
          rlArr.addShort( 0 ); // 3
          rlArr.addShort( 20 );
          rlArr.addSFSObject( rlSubObj );
          rlParentArr.addSFSArray( rlArr );
          // console.log("Array size:", rlArr.size()); // Output: 2
          // console.log("Array dump:", rlArr.getDump()); // Should show both 0 and 5

          msgData.putShort( "rs", 0 );
          msgData.putUtfString( "zn", "aviator_core_inst4_sa" );
          msgData.putUtfString( "un", "a7kbetbr_30248538&&7kbetbr" );
          msgData.putShort( "pi", 0 );
          msgData.putSFSArray( "rl", rlParentArr );
          msgData.putInt( "id", 11613039 );
        } else if( i===1 ) {
          const muls = [ 1.24, 2.68, 2.65, 12.53, 4.51, 4.62, 1.14, 1.01, 2.21, 1, 1.11, 23.34, 1.04, 7, 8.68, 1.49, 1.25, 1.13, 1.15, 11.97, 1.14, 1.29, 71.33, 1.34, 3.49 ];
          const rids = [ 2509640, 2509639, 2509638, 2509637, 2509636, 2509635, 2509634, 2509633, 2509632, 2509631, 2509630, 2509629, 2509628, 2509627, 2509626, 2509625, 2509624, 2509623, 2509622, 2509621, 2509620, 2509619, 2509618, 2509617, 2509616 ];
          // const pArr = new SFS2X.SFSArray();
          const pObj = new SFS2X.SFSObject();
          const roundsInfo = new SFS2X.SFSArray();

          for (let i = 0; i < muls.length; i++) {
            const roundObj = new SFS2X.SFSObject();
            roundObj.putDouble( "maxMultiplier", muls[ i ] );
            roundObj.putLong( "roundId", rids[ i ] );
            roundsInfo.addSFSObject( roundObj );
          }

          const userSettings = new SFS2X.SFSObject();
          userSettings.putBool( "music", true );
          userSettings.putBool( "sound", true );
          userSettings.putBool( "secondBet", true );
          userSettings.putBool( "animation", true );
          
          const user = new SFS2X.SFSObject();
          user.putSFSObject( "settings", userSettings );
          user.putDouble( "balance", 24.32 );
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
          pObj.putSFSArray( "activeBets", empArr );
          pObj.putInt( "onlinePlayers", 363 );
          pObj.putSFSArray( "activeFreeBetsInfo", empArr );
          pObj.putSFSObject( "user", user );
          pObj.putSFSObject( "config", config );
          pObj.putInt( "roundId", 2509640 );
          pObj.putInt( "stageId", 3 );
          // pArr.addSFSObject( pObj );

          msgData.putSFSObject( "p", pObj );
          msgData.putUtfString( "c", "init" );
        }
        paramArr.push( msgData );
      }
      break;
    case 13 :
      const obj13 = new SFS2X.SFSObject;
      const pObj = new SFS2X.SFSObject();
      pObj.putInt( "newStateId", 1 );
      pObj.putInt( "code", 200 );
      pObj.putInt( "roundId", 2509641 );
      pObj.putInt( "timeLeft", 5000 );
      obj13.putSFSObject( "p", pObj );
      obj13.putUtfString( "c", "changeState" );
      paramArr.push( obj13 );

      break;
  }

  return paramArr ;
}