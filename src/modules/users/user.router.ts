import { Router } from 'express'
import { createRouter } from 'src/libs/router-builder'
import { getUsersHandler } from './get-users'

export const usersRouter = createRouter()
    .addEndpoint('/', 'get', getUsersHandler)
    .build()
