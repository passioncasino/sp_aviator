export interface IAviatorStatus {
    roundId: number
    state: number
    multiplier: number
    crashX: number
    roundStartDate: number
    roundEndDate: number
    step: number,
    duration: number
}

export const aviatorStatus: IAviatorStatus = {
    roundId: 2537417,
    state: 1, // 0: waiting, 1: playing, 2: crashed
    multiplier: 1.00,
    crashX: 1.08,
    roundStartDate: 0,
    roundEndDate: 0,
    step: 0,
    duration: 1500
}