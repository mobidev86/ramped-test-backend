import express, { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
const router = express.Router();
const dashboardService = new DashboardService()
//#region job pots list Route
router.get('/list', async (req: Request, res: Response) => {
    const response = await dashboardService.getDashboardJobsList(req.query)
    return res.status(response.statusCode).json(response);
});
//#endregion


export const dashboardRoute = router;
