import { getDBManager } from 'src/config/database-connection'
import { WithAuthentication } from 'src/services/authenticator'
import { GetUsersEndpoint } from '@shared/functions/users/get-users'
import { UserModel } from './_models/user.model'

export const getUsersHandler: WithAuthentication<GetUsersEndpoint> = async ({
    auth: { id: userId },
}) => {
    const users = await getDBManager()
        .createQueryBuilder()
        .select('user')
        .from(UserModel, 'user')
        .where('user.id != :userId', { userId })
        .getMany()


    return {
        success: true,
        status: 'USERS_RECEIVED',
        users: users.map(({ password, ...userWithoutPassword }) => userWithoutPassword),
    }
}
