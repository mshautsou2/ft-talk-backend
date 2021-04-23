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
import { v4 as uuid } from 'uuid'



import fs from 'fs'

export const messageGateway = createSocketGateway()
    .withMiddleware(async ({ socket, next }) => {
        console.log('AUTHENTICATION....')
        if (socket.handshake.query && socket.handshake.query.token) {
            try {
                const authInfo = await decodeToken(
                    socket.handshake.query.token as string
                )
                socket.data.authInfo = authInfo
                console.log("AUTHORIZED AS", authInfo)
                next()
            } catch(e) {
                console.log(e)
            }
        } else {
            console.log('NOT AUTHORIZED')
        }
    })
    .withSocketHandler<ChatActionInfo>('join', async ({ socket, chatId }) => {
        console.log('JOINING....')

        const { authInfo } = socket.data
        if (authInfo) {
            console.log(authInfo)
            await ensureUserAuthorizedToAccessChat(chatId, authInfo.id)
            console.log('AUTHENTICATION VERFIED')
            socket.join(chatId)
            console.log('socket ', socket.id, 'connected to', chatId)
        } else {
            throw new Error('Authorization error')
        }
    })
    .withSocketHandler<ChatActionInfo>('leave', async ({ socket, chatId }) => {
        console.log('LEAVING....')

        socket.leave(chatId)
    })
    .withSocketHandler<CreateMessage>(
        'message',
        async ({ socket, chatId, blob }) => {
            console.log('MESSAGING....')



            const messageId = uuid()
            fs.writeFileSync(`./temp/${messageId}.wav`, blob as any)

            const message = await getDBManager().save(
                new MessageModel({
                    resourceId: messageId,
                    author: socket.data.authInfo.id as UserModel,
                    chat: (chatId as unknown) as ChatModel,
                    timestamp: new Date(),
                })
            )

            if (message) {
                const newMessage = {
                    id: message.id,
                    content: message.content,
                    resourceId: message.resourceId,
                    author: {
                        fullName: socket.data.authInfo.fullName,
                    },
                }
                socket.to(chatId).emit('message', newMessage)
                socket.emit('message', newMessage)
            }
        }
    ).build()
