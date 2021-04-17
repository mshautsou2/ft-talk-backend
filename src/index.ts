import axios from 'axios'
import { urlencoded, json } from 'body-parser'
import express from 'express'
import { authRouter } from './modules/auth/auth.router'
import { authenticate } from './services/authenticator'
import { logger } from './services/logger'
import cors from 'cors'
import { chatsRouter } from './modules/chats/chats.router'

const app = express()
const PORT = 8002

app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(json())
app.use('/auth', authRouter)
app.use('/chats', chatsRouter)

app.get('/', (req, res) => res.send('ok'))

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    logger.info(`server started at http://localhost:${PORT}`)
})
