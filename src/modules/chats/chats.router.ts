import { Router } from 'express'
import { createRouter } from 'src/libs/router.builder'
import { createChatHandler } from './create-chat'
import { exploreChatsHandler } from './explore-chats'
import { getAllChatsHandler } from './get-all-chats'
import { getMyChatsHandler } from './get-my-chats'
import { joinChatRequestHandler } from './join-chat-request'

export const chatsRouter = createRouter()
    .withEndpoint('/mine', 'get', getMyChatsHandler)
    .withEndpoint('/explore', 'get', exploreChatsHandler)
    .withEndpoint('/join', 'post', joinChatRequestHandler)
    .withEndpoint('/', 'get', getAllChatsHandler)
    .withEndpoint('/', 'post', createChatHandler)
    .build()
