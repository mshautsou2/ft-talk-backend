import { ExploreChatsEndpoint } from '@shared/functions/chats/explore-chats'
import { JoinChatRequestEndpoint } from '@shared/functions/chats/join-chat-request'
import { getDBManager } from 'src/config/database-connection'
import { WithAuthentication } from 'src/services/authenticator'
import { UserModel } from '../users/_models/user.model'
import { ChatModel } from './models/chat.model'
import { ParticipantModel } from './models/participant.model'

export const joinChatRequestHandler: WithAuthentication<JoinChatRequestEndpoint> = async ({
    auth: { id: userId },
    chatId,
}) => {

    const chat = await getDBManager().findOne(ChatModel, chatId)
    if (!chat.isPrivate) {
        await getDBManager().save(ParticipantModel, new ParticipantModel({
            chat,
            user: userId as unknown as UserModel,
        }))
        return {
            success: true,
            status: 'JOIN_ACCEPTED',
        }
    } else {
        return {
            success: false,
            status: 'JOIN_REJECTED',
        }
    }

}
