import { WebSocketServer, WebSocket } from 'ws';
import { aviatorService } from '@/api/game/aviator/service';
import { gameStateHandler, userInfoHandler } from '@/api/game/aviator/infoHandler';

const socketServer = {
    initSocket: ( server: any ) => {
        const wss = new WebSocketServer({ server });
        wss.on('connection', (ws: WebSocket, req: any) => {
            const { url } = req;
            console.log(`WebSocket server is running on wss://${process.env.GAMESERVERHOST}, url=${url}`);
            if ( ws.readyState===WebSocket.OPEN ) {
                const msgHandler = async ( msgs: any[] ) => {
                    msgs.forEach((msg: Buffer) => ws.send( msg ));
                };    
        
                if( url==="/BlueBox/websocket" ) {
                    ws.on(`message`, (msg) => {
                        const msgs = aviatorService.handleMsg( msg );
                        msgHandler( msgs );
                        // ws.send("aa");
                    });
                    
                    const intervalId = setInterval(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            // const msg = aviatorService.sendPing();
                            // if( msg !== null ) ws.send(msg);
                        }
                    }, 100);
                    
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