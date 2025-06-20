import fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { WebSocketServer, WebSocket } from 'ws';

import { app, logger } from "@/server";
import { env } from "@/common/utils/envConfig";

const useHttps = env.USE_HTTPS;
let server: any ;
let protocol = useHttps ? "https" : "http";

if (useHttps) {
  const certOptions = {
      key: fs.readFileSync(env.SSL_PRIVATE_KEY),
      cert: fs.readFileSync(env.SSL_CERTIFICATE),
      ca: fs.readFileSync(env.SSL_CA_BUNDLE),
  };
  server = https.createServer(certOptions, app);
} else {
  server = http.createServer(app);
}

const wss = new WebSocketServer({ server });
wss.on('connection', (ws: WebSocket, req: any) => {
  const { url } = req;
  console.log(`WebSocket server is running on ws://${process.env.GAMESERVERHOST}, url=${url}`);
  switch (url) {
    case "/BlueBox/websocket":
      ws.on(`message`, (msg) => {
        console.log(`here msg=`, msg)
      })
      break;
    default:
      break;
  }
});

server.listen(env.PORT, () => {
  const { NODE_ENV, GAMESERVERHOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port ${protocol}://${GAMESERVERHOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
