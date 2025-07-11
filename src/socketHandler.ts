import { WebSocketServer, WebSocket } from 'ws';
import { msgHandler } from '@/api/game/aviator/controller';
import { aviatorStatus } from './api/utill/global';
import { generateRandString } from './api/utill/functions';

interface ExtWebSocket extends WebSocket {
    socketId: string;
}

const socketServer = {
    initSocket: ( server: any ) => {
        const wss = new WebSocketServer({ server });
        wss.on('connection', (extWs: ExtWebSocket, req: any) => {
            const { url } = req;
            console.log(`WebSocket server is running on wss://${process.env.GAMESERVERHOST}, url=${url}, connected players=${ wss.clients.size }`);
            extWs.socketId = generateRandString( "", 20, 1 );
            if ( extWs.readyState===WebSocket.OPEN ) {
                const msgSender = async ( msgs: any[] ) => {
                    msgs.forEach((msg: Buffer) => extWs.send( msg ));
                };

                if( url==="/BlueBox/websocket" ) {
                    aviatorStatus.onlinePlayers = wss.clients.size;
                    extWs.on(`message`, async(msg) => {
                        const msgs = await msgHandler.getResponseMsg( msg, extWs.socketId );
                        msgSender( msgs );
                    });
                    
                    const intervalId = setInterval(async() => {
                        if (extWs.readyState === WebSocket.OPEN) {
                            const msgs = await msgHandler.getGameMultiplier();
                            const staker = aviatorStatus.stakers.find( staker => staker.socketId===extWs.socketId );
                            if( staker ) {
                                console.log(`staker=`, staker);
                                const balmsg = msgHandler.getPlayerBalance( staker );
                                msgs.push( balmsg );
                            }
                            msgSender( msgs );
                        }
                    }, aviatorStatus.duration);
                    
                    extWs.on('close', () => {
                        aviatorStatus.onlinePlayers = wss.clients.size;
                        clearInterval(intervalId);
                    });
                }
            }
        });
        return null;
    }
}

export default socketServer;