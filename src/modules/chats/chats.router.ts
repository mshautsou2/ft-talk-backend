import { Router } from 'express'
import { createRouter } from 'src/libs/router-builder'
import { createChatHandler } from './create-chat'
import { getAllChatsHandler } from './get-all-chats'
import { getMyChatsHandler } from './get-my-chats'

export const chatsRouter = createRouter()
    .addEndpoint('/mine', 'get', getMyChatsHandler)
    .addEndpoint('/', 'get', getAllChatsHandler)
    .addEndpoint('/', 'post', createChatHandler)
    .build()
