import { WebSocketServer, WebSocket } from 'ws';
import { msgHandler } from '@/api/game/aviator/controller';
import { aviatorStatus } from './api/game/aviator/global';

const socketServer = {
    initSocket: ( server: any ) => {
        const wss = new WebSocketServer({ server });
        wss.on('connection', (ws: WebSocket, req: any) => {
            const { url } = req;
            console.log(`WebSocket server is running on wss://${process.env.GAMESERVERHOST}, url=${url}`);
            if ( ws.readyState===WebSocket.OPEN ) {
                const msgSender = async ( msgs: any[] ) => {
                    msgs.forEach((msg: Buffer) => ws.send( msg ));
                };

                if( url==="/BlueBox/websocket" ) {
                    ws.on(`message`, async(msg) => {
                        const msgs = await msgHandler.getResponseMsg( msg );
                        msgSender( msgs );
                    });
                    
                    const intervalId = setInterval(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            const msgs = msgHandler.getGameMultiplier();
                            msgSender( msgs );
                        }
                    }, aviatorStatus.duration);
                    
                    ws.on('close', () => {
                        clearInterval(intervalId);
                    });
                }
            }
        });
        return null;
    }
}

export default socketServer;