import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';
import * as path from 'path';
import express, { type Express } from 'express';

import { apiRouter } from '@/router';
import mongoUtils from '@/api/models';
import errorHandler from '@/common/middleware/errorHandler';
import requestLogger from '@/common/middleware/requestLogger';

const app: Express = express();
const logger = pino({ name: "server start" });

app.set('view engine', 'ejs');
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(express.static(path.join(__dirname, 'public')));

mongoUtils.connect().then( async (loaded) => {
    if( loaded ) {
        app.set("trust proxy", true);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLogger);

        app.get('/:game', async( req, res ) => {
            const game = req.params.game;
            res.render('aviator/index')
        })
        app.use('/api', apiRouter);
        
        app.use(errorHandler());
    }
})

export { app, logger };