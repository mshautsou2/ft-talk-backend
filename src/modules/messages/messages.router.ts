import { Router } from 'express'
import { createRouter } from 'src/libs/router.builder'
import { createMessageHandler } from './create-message'
import { getMessagesHandler } from './get-messages'

export const messagesRouter = createRouter()
    .withEndpoint('/:chatId/messages', 'get', getMessagesHandler)
    .withEndpoint('/:chatId/messages', 'post', createMessageHandler)
    .build()
