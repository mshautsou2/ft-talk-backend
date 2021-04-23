import { Request, RequestHandler, Response } from 'express'
import { JWT_SECRET } from 'src/config/secrets'
import jwt from 'jsonwebtoken'
import { decodeToken } from './jwt.utils'

export type AuthInfo = {
    id: string
    fullName: string
    phoneNumber: string
    username: string
}

export type WithAuthentication<T extends (...args: any) => any> = (args: Parameters<T>[0] & { auth: AuthInfo }) => ReturnType<T>


export const authenticate = async (req: Request<any>, res: Response, next: any) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        try {
            const authInfo = await decodeToken(token)
            res.locals.auth = authInfo
            next()
        } catch (e) {
            return res.send({
                success: false,
                status: 'INVALID_TOKEN',
            })
        }
    } else {
        res.send({
            success: false,
            status: 'UNAUTHORIZED',
        })
    }
}
