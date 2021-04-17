import { Router } from 'express'
import { createRouter } from 'src/libs/router-builder'
import { getMyChatsHandler } from './get-my-chats'

export const chatsRouter = createRouter()
    .addEndpoint('/mine', 'get', getMyChatsHandler)
    .build()
