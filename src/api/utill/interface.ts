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
    currency: number
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

export interface IAct0Params {
    ct: number
    ms: number
    tk: string
}

export interface IAct1Params {
    userId: string
    balance: number
    property: any
    pastGames: any[]
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

// Player
export interface IUPlayer {
    roundId: number
    username: string
    cashout: number
    multiplier: number
    cashOutDate: number
}

export interface IStaker {
    socketId: string
    balance: number
}

export interface IPlayerRound {
    seed: string
    profileImage: string
    username: string
}