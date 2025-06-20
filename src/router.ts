import express, { Request, Response, Router } from 'express';
import { commonService } from '@/api/game/commonService';

export const gameRouter: Router = (() => {
    const router = express.Router();

    router.post('/get_launcher_url', async (req: Request, res: Response) => {
        const params: any = req.body;
        const launcher = await commonService.provideLauncher( params );
        res.send( launcher );
    });

    return router;
})();