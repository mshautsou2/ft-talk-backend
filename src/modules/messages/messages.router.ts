import { Router } from 'express'
import { createRouter } from 'src/libs/router-builder'
import { createMessageHandler } from './create-message'
import { getMessagesHandler } from './get-messages'

export const messagesRouter = createRouter()
    .addEndpoint('/:chatId/messages', 'get', getMessagesHandler)
    .addEndpoint('/:chatId/messages', 'post', createMessageHandler)
    .build()
