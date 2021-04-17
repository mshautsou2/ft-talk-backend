import { getDBManager } from 'src/config/database-connection'
import { AuthInfo, WithAuthentication } from 'src/services/authenticator'
import { GetAllChatsEndpoint } from '../../../ft-talk-shared/src/functions/chats/get-all-chats'
import { ChatModel } from './models/chat.model'

export const getAllChatsHandler: WithAuthentication<GetAllChatsEndpoint> = async ({
    auth: { id: userId },
}) => {

    const chats = await getDBManager()
        .createQueryBuilder()
        .select('chat')
        .from(ChatModel, 'chat')
        .getMany()


    return {
        success: true,
        status: 'CHATS_RECEIVED',
        chats,
    }
}
