declare interface SchemeUser {
    balance: number
    property: {
        game: string
        // userId: string
        username: string
        profileImage: string
        operator: string
    },
    settings: {
        music: boolean
        sound: boolean
        secondBet: boolean
        animation: boolean
    }
}

declare interface SchemeGame {
    roundId: number
    multiplier: number
    maxMultiplier: number
}

declare interface SchemePlyer {
    bet: number
    player_id: string
    betId: number
    profileImage: string
    username: string
}

declare interface SchemeHistory {
    roundId: number
    maxMultiplier: number
}