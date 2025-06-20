import fs from 'fs';
import cors from "cors";
import helmet from "helmet";
import { pino } from "pino";
import * as path from 'path';

import express, { type Express } from "express";

import { env } from "@/common/utils/envConfig";
import { connect } from "@/common/models";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";

import { gameRouter } from "@/router";

const logger = pino({ name: "server start" });
const app: Express = express();

connect(String(env.DBNAME) ).then( async (loaded) => {
    if( loaded ) {
        app.set('view engine', 'ejs');
        app.use(express.static(path.join(__dirname, 'public')));
        app.use("/health-check", healthCheckRouter);
        app.set("trust proxy", true);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        // app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
        app.use(cors({ origin: "*", credentials: true }));
        app.use(helmet());
        app.use(requestLogger);
        app.get('/', async( req, res ) => {
            res.render('aviator/index')
        })
        app.use('/gs2c', gameRouter);
        
        app.use(errorHandler());
    }
})

export { app, logger };