import { getDBManager } from 'src/config/database-connection'
import { UserModel } from '../users/_models/user.model'

import { SignInEndpoint } from '../../../ft-talk-shared/src/functions/auth/sing-in'
import { HandlingError } from 'src/libs/router.builder'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from 'src/config/secrets'

export const signInHandler: SignInEndpoint = async ({
    password,
    phoneNumber,
}) => {
    const user = await findUserByPhoneNumberAndPassword(phoneNumber, password)

    const accessToken = generateAccessToken(user)

    return {
        success: true,
        status: 'LOGGED_IN',
        accessToken,
    }
}

async function findUserByPhoneNumberAndPassword(
    phoneNumber: string,
    password: string
): Promise<UserModel> {
    const user = await getDBManager().findOne(UserModel, {
        where: [
            {
                phoneNumber,
                password,
            },
        ],
    })
    if (!user) {
        throw new HandlingError('CREDENTIALS_INVALID')
    }
    return user
}

function generateAccessToken(user: UserModel): string {
    return jwt.sign(
        {
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            username: user.username,
        },
        JWT_SECRET
    )
}
