import { Request, RequestHandler, Response } from 'express'
import { JWT_SECRET } from 'src/config/secrets'
import jwt from 'jsonwebtoken'

export type AuthInfo = {
    id: string
    fullName: string
    phoneNumber: string
    username: string
}

export type WithAuthentication<T extends (...args: any) => any> = (args: Parameters<T>[0] & { auth: AuthInfo }) => ReturnType<T>


export const authenticate = (req: Request<any>, res: Response, next: any) => {
    const authHeader = req.headers.authorization


    if (authHeader) {
        const token = authHeader.split(' ')[1]


        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    status: 'INVALID_TOKEN',
                })
            }

            res.locals.auth = user
            next()
        })
    } else {
        res.send({
            success: false,
            status: 'UNAUTHORIZED',
        })
    }
}
