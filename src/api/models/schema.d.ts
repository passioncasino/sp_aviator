declare interface SchemeUser {
    balance: number
    property: {
        game: string
        // userId: string
        username: string
        profileImage: string
        operator: string
        session: string
    },
    gameStatus: {
        isInit: boolean
        betAmount: number
        betId: number
        freeBet: boolean
    }
    settings: {
        music: boolean
        sound: boolean
        secondBet: boolean
        animation: boolean
    }
}

declare interface SchemeGame {
    maxMultiplier: number
    endDate: number
    zone: string
    roundStartDate: number
    roundId: number
    serverSeed: string
}

declare interface SchemePlayer {
    username: string
    roundId: number
    winAmount: number
    multiplier: number
    betId: number
    freeBet: boolean
}

declare interface SchemeHistory {
    roundId: number
    maxMultiplier: number
}