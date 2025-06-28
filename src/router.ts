import express, { Request, Response, Router } from 'express';
import { apiHandler } from '@/api/apiHandler';
import { ILauncherParams } from './api/utill/interface';

export const apiRouter: Router = (() => {
    const router = express.Router();

    router.post('/start-game-v2', async (req: Request, res: Response) => {
        const { slug, platform, use_demo } = req.query;
        const { username, lang, currency, operator, return_url } = req.body;
        const params: ILauncherParams = {
            game: slug as string,
            lang: lang,
            currency: currency,
            username: username,
            operator: operator,
            return_url: return_url
        };
        const launcher = await apiHandler.provideLauncher( params );
        res.send( launcher );
    });

    return router;
})();