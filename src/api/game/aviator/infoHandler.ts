import { aviatorStatus } from "./aviatorState"

enum GAME_STATE {
    READY = 'READY',
    BET = 'BET',
    PLAYING = 'PLAYING',
    GAMEEND = 'GAMEEND'
}

export const gameStateHandler = {
    getGameState: () => {
        let controller = "changeState";
        switch( aviatorStatus._state ) {
            case 0: // ready
                break;
            case 1: // bet
                break;
            case 2: // playing
                break;
            case 3: // end
                break;
        }
    }
}

export const userInfoHandler = {

}