import { Router } from 'express'
import { createRouter } from 'src/libs/router-builder'
import { signUpHandler } from './sign-up'
import { signInHandler } from './sign-in'

export const authRouter = createRouter()
    .addEndpoint('/sign-up', 'post', signUpHandler)
    .public()
    .addEndpoint('/sign-in', 'post', signInHandler)
    .public()
    .build()
