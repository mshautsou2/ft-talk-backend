import { Request, RequestHandler, Response } from "express";
import { JWT_SECRET } from "src/config/secrets";
import jwt from 'jsonwebtoken'

export const authenticate = (req: Request<any>, res: Response, next: any) => {
    console.log('trying to authentication')
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            res.locals.user = user;
            next(req, res, next);
        });
    } else {
        res.send({
            success: false,
            status: 'UNAUTHORIZED'
        });
    }
};