import { aviatorStatus } from "../utill/global";

const games: SchemeGame[] = [
    { 
        roundId: aviatorStatus.roundId-1, 
        maxMultiplier: 2.05, 
        roundStartDate: Date.now(), 
        roundEndDate: Date.now(), 
        serverSeed: "",
        totalCashOut: 1200
    }
];

const players: SchemePlayer[] = [
    {
        username: "a7kbetbr_30248538",
        roundId: aviatorStatus.roundId,
        betAmount: 30,
        winAmount: 0,
        multiplier: 0,
        betId: 1,
        freeBet: false,
        currency: 0,
        profileImage: "av-61.png",
        cashOutDate: 1752077244520,
        roundBetId: 1752077256637,
        clientSeed: "wqI7Xcrrlh3E2vJOr3gZ-199",
    },
    {
        username: "a7kbetbr_30235643",
        roundId: aviatorStatus.roundId,
        betAmount: 4,
        winAmount: 0,
        multiplier: 0,
        betId: 1,
        freeBet: false,
        currency: 0,
        profileImage: "av-32.png",
        cashOutDate: 1752077244520,
        roundBetId: 1752077256637,
        clientSeed: "wqI7Xcrrlh3E2vJOr3gZ-199",
    },
];

const histories: SchemeHistory[] = [
    {
        username: "a7kbetbr_30248538",
        roundId: aviatorStatus.roundId,
        betAmount: 30,
        winAmount: 42,
        multiplier: 1.4,
        betId: 1,
        freeBet: false,
        currency: 0,
        profileImage: "av-61.png",
        cashOutDate: 1752077244520,
        roundBetId: 1752077256637,
        clientSeed: "wqI7Xcrrlh3E2vJOr3gZ-199",
        maxMultiplier: 2.05
    },
    {
        username: "a7kbetbr_30235643",
        roundId: aviatorStatus.roundId,
        betAmount: 4,
        winAmount: 0,
        multiplier: 0,
        betId: 1,
        freeBet: false,
        currency: 0,
        profileImage: "av-32.png",
        cashOutDate: 1752077244520,
        roundBetId: 1752077256637,
        clientSeed: "wqI7Xcrrlh3E2vJOr3gZ-199",
        maxMultiplier: 2.05
    },
    {
        username: "a7kbetbr_20227865",
        roundId: aviatorStatus.roundId-1,
        betAmount: 50,
        winAmount: 90,
        multiplier: 1.8,
        betId: 2,
        freeBet: false,
        currency: 0,
        profileImage: "av-22.png",
        cashOutDate: 1752077244520,
        roundBetId: 1752077256637,
        clientSeed: "wqI7Xcrrlh3E2vJOr3gZ-199",
        maxMultiplier: 2.55
    }
];

export default {
    games,
    players,
    histories
}