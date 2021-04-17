import { CreateMessageEndpoint } from '@shared/functions/messages/create-message'
import { getDBManager } from 'src/config/database-connection'
import { WithAuthentication } from 'src/services/authenticator'
import { ChatModel } from '../chats/models/chat.model'
import { UserModel } from '../users/_models/user.model'
import { MessageModel } from './models/message.model'
import { ensureUserAuthorizedToAccessChat } from './_helper/permission.helper'

export const createMessageHandler: WithAuthentication<CreateMessageEndpoint> = async ({
    auth: { id: userId },
    chatId,
    audioLink,
    content,
}) => {
    await ensureUserAuthorizedToAccessChat(chatId, userId)

    const message = await getDBManager().save(
        new MessageModel({
            audioLink,
            author: (userId as unknown) as UserModel,
            chat: (chatId as unknown) as ChatModel,
            content,
            timestamp: new Date(),
        })
    )

    return {
        success: true,
        status: 'MESSAGE_CREATED',
        message: {
            ...message,
            chatId: message.chat.id,
        }
    }
}
