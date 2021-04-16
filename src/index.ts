import axios from "axios";
import { urlencoded, json } from "body-parser";
import express from "express";
import { authRouter } from "./modules/auth/auth.router";
import { logger } from "./services/logger";

const app = express();
const PORT = 8000

app.use(urlencoded({ extended: false }))
app.use(json())

app.use('/auth', authRouter)

app.get('/', (req, res) => res.send('ok'))

app.listen( PORT, () => {
    // tslint:disable-next-line:no-console
    logger.info( `server started at http://localhost:${ PORT }` );
} );