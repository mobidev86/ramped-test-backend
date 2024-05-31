import { Request, Response, NextFunction } from 'express';
import { errorAuthenticationFailed } from './constants';
import { verifyToken } from './crypt.service';

interface AuthRequest extends Request {
    user?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('authorization');

    if (!token)
        return res.status(401).send({ message: errorAuthenticationFailed })
    try {
        const decoded: any = verifyToken(token)
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ message: errorAuthenticationFailed })
    }
    next();
};
export default auth;
export { AuthRequest };
