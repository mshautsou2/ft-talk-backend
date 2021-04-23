import axios from 'axios'
import { urlencoded, json } from 'body-parser'
import express from 'express'
import { authRouter } from './modules/auth/auth.router'
import { authenticate } from './services/authenticator'
import { logger } from './services/logger'
import cors from 'cors'
import { chatsRouter } from './modules/chats/chats.router'
import { usersRouter } from './modules/users/user.router'
import { messagesRouter } from './modules/messages/messages.router'
import { createSocketIOServer } from './services/socket.server'
import http  from 'http'
import { messageGateway } from './modules/message-gateway/messages.gateway'
import fs from 'fs'

const app = express()
const PORT = 8003
// @ts-ignore
const server = http.Server(app)


app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(json())

app.get('/resources/:resourceId', (req, res) => {
    fs.createReadStream(`./temp/${req.params.resourceId}.wav`).pipe(res)
})
app.use('/auth', authRouter)
app.use('/chats', chatsRouter)
app.use('/users', usersRouter)
app.use('/chats', messagesRouter)

app.get('/', (req, res) => res.send('ok'))


createSocketIOServer(server, [ messageGateway ])

server.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    logger.info(`server started at http://localhost:${PORT}`)
})
