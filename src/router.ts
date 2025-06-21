import express, { Request, Response, Router } from 'express';
import { commonService } from '@/api/game/commonService';
import { ILauncherParams } from './api/utill/interface';

export const apiRouter: Router = (() => {
    const router = express.Router();

    router.post('/start-game-v2', async (req: Request, res: Response) => {
        const { slug, platform, use_demo } = req.query;
        const { user, lang, currency } = req.body;
        const params: ILauncherParams = {
            game: slug as string,
            lang: lang,
            currency: currency,
            user: user
        };
        console.log(`params=`, params);
        const launcher = await commonService.provideLauncher( params );
        res.send( launcher );
    });

    return router;
})();