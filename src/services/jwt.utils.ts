import jwt from 'jsonwebtoken'
import { JWT_SECRET } from 'src/config/secrets'
import { AuthInfo } from './authenticator'

export async function decodeToken(token: string): Promise<AuthInfo> {

    return new Promise((resolve, reject) => {

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                reject(err)
            }
            resolve(user as AuthInfo)
        })
    })

}