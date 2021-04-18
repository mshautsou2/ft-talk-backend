import { Router } from 'express'
import { createRouter } from 'src/libs/router.builder'
import { createChatHandler } from './create-chat'
import { getAllChatsHandler } from './get-all-chats'
import { getMyChatsHandler } from './get-my-chats'

export const chatsRouter = createRouter()
    .withEndpoint('/mine', 'get', getMyChatsHandler)
    .withEndpoint('/', 'get', getAllChatsHandler)
    .withEndpoint('/', 'post', createChatHandler)
    .build()
