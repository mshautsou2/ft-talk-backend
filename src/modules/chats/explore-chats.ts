import { ExploreChatsEndpoint } from '@shared/functions/chats/explore-chats'
import { getDBManager } from 'src/config/database-connection'
import { WithAuthentication } from 'src/services/authenticator'
import { ChatModel } from './models/chat.model'

export const exploreChatsHandler: WithAuthentication<ExploreChatsEndpoint> = async ({
    auth: { id: userId },
}) => {

    const chats = await getDBManager()
        .createQueryBuilder()
        .select('chat')
        .from(ChatModel, 'chat')
        .leftJoinAndSelect('chat.participants', 'participants')
        // .where('participants.id != :userId', { userId })
        .andWhere('NOT chat.isPrivate')
        .getMany()


    return {
        success: true,
        status: 'CHATS_RECEIVED',
        chats,
    }
}
