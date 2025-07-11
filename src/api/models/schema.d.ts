declare interface SchemeUser {
    balance: number
    property: {
        game: string
        username: string
        profileImage: string
        operator: string
        session: string
        currency: number
        socketId: string
    },
    gameStatus: {
        isInit: boolean
        lastRound: number
        stake: number
        f: {
            betAmount: number
            betId: number
            freeBet: boolean
            autoCashOut: number
        }
        s: {
            betAmount: number
            betId: number
            freeBet: boolean
            autoCashOut: number
        }
    }
    // settings: {
    //     music: boolean
    //     sound: boolean
    //     secondBet: boolean
    //     animation: boolean
    // }
}

declare interface SchemeGame {
    roundId: number
    maxMultiplier: number
    roundStartDate: number
    roundEndDate: number
    serverSeed: string
    totalCashOut: number
    // zone: string
}

declare interface SchemePlayer {
    username: string
    roundId: number
    betAmount: number
    winAmount: number
    multiplier: number
    cashOutDate: number
    betId: number
    freeBet: boolean
    currency: number
    profileImage: string
    cashOutDate: number
    roundBetId: number
    clientSeed: string
}

declare interface SchemeHistory extends SchemePlayer {
    maxMultiplier: number
}
