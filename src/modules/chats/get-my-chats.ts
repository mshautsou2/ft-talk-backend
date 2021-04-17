import { getDBManager } from 'src/config/database-connection'
import { AuthInfo, WithAuthentication } from 'src/services/authenticator'
import { GetMyChatsEndpoint } from '../../../ft-talk-shared/src/functions/chats/get-my-chats'
import { ChatModel } from './models/chat.model'

export const getMyChatsHandler: WithAuthentication<GetMyChatsEndpoint> = async ({
    auth: { id: userId },
}) => {
    console.log('authentication')

    const chats = await getDBManager()
        .createQueryBuilder()
        .select('chat')
        .from(ChatModel, 'chat')
        .leftJoinAndSelect('chat.participants', 'participants')
        .where('participants.id = :userId', { userId })
        .getMany()


    return {
        success: true,
        status: 'CHATS_RECEIVED',
        chats,
    }
}
