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
    // userId : string
    balance: number
    username: string
    currency: string
    operator: string
}