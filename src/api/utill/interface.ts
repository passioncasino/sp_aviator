export interface ILauncherParams {
    game : string
    lang : string
    currency : string
    username : string
    operator : string
    return_url : string
}

export interface IUserInfo {
    game: string
    lang: string
    token: string
    balance: number
    username: string
    currency: string
    operator: string
    session: string
}

export interface TsfsArrItem {
    type: number
    value: boolean | number | string | any[]
}

export interface TsfsItem {
    prop: string
    type: number
    value: boolean | number | string | any[]
}

export interface IStaticMsgParam {
    _aid: number
    _cid: number
    controller: string
    cFlag: boolean
}

export interface IAct0Params {
    ct: number
    ms: number
    tk: string
}

export interface IAct1Params {
    username: string
    // settings: {
    //     music: boolean
    //     sound: boolean
    //     secondBet: boolean
    //     animation: boolean
    // }
}

export interface Icoh {
    username: string
    operator: string
    betId: number
    betAmount: number
    multiplier: number
    cashout: number
}

export interface IBet {
    bet: number
    code: number
    freeBet: number
    betId: number
    profileImage: string
    username: string
    operator: string
    profile: string
}

export interface IucbParams {
    betsCount: number
    activePlayersCount: number
    bets: []
    topPlayerProfileImages: []
}

export interface IUCCOParams {
    openBetsCount: number
    activePlayersCount: number
    totalCashOut: number
    topImages: string[]
}