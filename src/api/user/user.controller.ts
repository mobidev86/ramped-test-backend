import express, { Request, Response } from 'express';
import { UserService } from './user.service';

const router = express.Router();
const userService = new UserService()
//#region  Signup Route
router.post('/signup', async (req: Request, res: Response) => {
    const response = await userService.funUserRegister(req.body)
    return res.status(response.statusCode).json(response);
});
//#endregion

//#region Login Route
router.post('/login', async (req: Request, res: Response) => {
    const response = await userService.funUserLogin(req.body)
    return res.status(response.statusCode).json(response);
});
//#endregion

export const userRoute = router;
