import { Router } from "express";
import { signUpHandler } from './sign-up'
export const authRouter = Router()

authRouter.post('/sign-up', async (req, res) => {
    res.send(await signUpHandler(req.body))
})