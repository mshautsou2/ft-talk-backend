import { getDBManager } from 'src/config/database-connection'
import { createSocketGateway } from 'src/libs/socket-gateway.builder'
import { AuthInfo } from 'src/services/authenticator'
import { decodeToken } from 'src/services/jwt.utils'
import { ChatModel } from '../chats/models/chat.model'
import { UserModel } from '../users/_models/user.model'
import { createMessageHandler } from '../messages/create-message'
import { MessageModel } from '../messages/models/message.model'
import { ensureUserAuthorizedToAccessChat } from '../messages/_helper/permission.helper'
import { ChatActionInfo } from '@shared/functions/messages-gateway/models/chat-action.model'
// import { CreateMessage } from '@shared/functions/messages-gateway/models/send-message'
import { CreateMessage } from '@shared/functions/messages-gateway/send-message'



export const messageGateway = createSocketGateway()
    .withMiddleware(async ({ socket, next }) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const authInfo = await decodeToken(
                socket.handshake.query.token as string
            )
            socket.data.authInfo = authInfo
            next()
        } else {
            throw new Error('Authorization error')
        }
    })
    .withSocketHandler<ChatActionInfo>('join', async ({ socket, chatId }) => {
        const { authInfo } = socket.data
        if (authInfo) {
            await ensureUserAuthorizedToAccessChat(chatId, authInfo.id)
            socket.join(chatId)
            console.log('socket ', socket.id, 'connected to', chatId)
        } else {
            throw new Error('Authorization error')
        }
    })
    .withSocketHandler<ChatActionInfo>('leave', async ({ socket, chatId }) => {
        socket.leave(chatId)
    })
    .withSocketHandler<CreateMessage>(
        'message',
        async ({ socket, content, chatId, audioLink }) => {
            console.log('sending message with creds', socket.data.authInfo)
            const message = await getDBManager().save(
                new MessageModel({
                    audioLink,
                    author: socket.data.authInfo.id as UserModel,
                    chat: (chatId as unknown) as ChatModel,
                    content,
                    timestamp: new Date(),
                })
            )

            if (message) {
                console.log('sending to chat ', chatId, message)
                const newMessage = {
                    id: message.id,
                    content: message.content,
                    audioLink: message.audioLink,
                    author: {
                        fullName: socket.data.authInfo.fullName,
                    },
                }
                socket.to(chatId).emit('message', newMessage)
                socket.emit('message', newMessage)
            }
        }
    ).build()
