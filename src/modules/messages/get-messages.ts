import { GetMessagesEndpoint } from '@shared/functions/messages/get-messges'
import { getDBManager } from 'src/config/database-connection'
import { HandlingError } from 'src/libs/router.builder'
import { AuthInfo, WithAuthentication } from 'src/services/authenticator'
import { GetAllChatsEndpoint } from '../../../ft-talk-shared/src/functions/chats/get-all-chats'
import { ChatModel } from '../chats/models/chat.model'
import { messagesRouter } from './messages.router'
import { MessageModel } from './models/message.model'
import { ensureUserAuthorizedToAccessChat } from './_helper/permission.helper'

export const getMessagesHandler: WithAuthentication<GetMessagesEndpoint> = async ({
    auth: { id: userId },
    chatId,
    from,
    amount,
}) => {

    if (!from || from < 0) {
        from = 0
    }

    if (amount <= 0) {
        amount = 100
    }

    await ensureUserAuthorizedToAccessChat(chatId, userId)

    const messages = await getDBManager()
        .createQueryBuilder()
        .select('message')
        .from(MessageModel, 'message')
        .leftJoinAndSelect('message.author', 'author')
        .orderBy('timestamp', 'ASC')
        .offset(from)
        .limit(amount)
        .andWhere('message.chat.id = :chatId', { chatId })
        .getMany()


    return {
        success: true,
        status: 'MESSAGES_RECEIVED',
        messages: messages.map(m => ({
            ...m,
            chat: undefined,
            author: {
                ...m.author,
                password: undefined,
            }
        })),
    }
}
