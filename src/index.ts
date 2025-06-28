import fs from 'fs';
import http from 'http';
import https from 'https';

import socketServer from '@/socketHandler';
import { app, logger } from '@/expressApp';
import { env } from '@/common/utils/envConfig';

let server: http.Server | https.Server;

const useHttps = env.USE_HTTPS;
const protocol = useHttps ? "https" : "http";

if (useHttps) {
    const certOptions = {
        key: fs.readFileSync(env.SSL_PRIVATE_KEY),
        cert: fs.readFileSync(env.SSL_CERTIFICATE),
        ca: fs.readFileSync(env.SSL_CA_BUNDLE),
    };
    server = https.createServer( certOptions, app );
} else {
    server = http.createServer( app );
}

server.listen(env.PORT, () => {
    logger.info(`Server (${process.env.NODE_ENV}) running on ${protocol}://${process.env.GAMESERVERHOST}:${env.PORT}`);
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

socketServer.initSocket( server );
