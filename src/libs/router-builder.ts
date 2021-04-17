import { Request, Response, Router } from 'express'
import { authenticate } from 'src/services/authenticator'

export type EndpointMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export class HandlingError {
    constructor(public status: string) {}
}

export type EndpointResponse = {
    success: boolean
    status: string
    [key: string]: any
}

type Route = {
    method: EndpointMethod
    path: string
    authenticationRequired: boolean
    handler: (req: Request, res: Response) => Promise<void>
}

export const createRouter = () => {
    const routes: Route[] = []
    const builder = {
        addEndpoint: (
            path: string,
            method: EndpointMethod,
            handler: (parameters: {
                [key: string]: any
                _req?: Request
                _res?: Response
            }) => Promise<EndpointResponse>
        ) => {
            routes.push({
                method,
                path,
                authenticationRequired: true,
                handler: async (req: Request, res: Response) => {

                    try {
                        const response = await handler({
                            ...(req.body ? {...req.body} : {}),
                            auth: res.locals.auth,
                            ...req.params,
                            _req: req,
                            _res: res,
                        })

                        res.send(response)
                    } catch (e) {
                        if (e instanceof HandlingError) {
                            res.send({
                                success: false,
                                status: e.status,
                            })
                        } else {
                            res.send({
                                success: false,
                                status: 'INTERNAL_ERROR',
                            })
                            console.error(e)
                        }
                    }
                },
            })
            return builder
        },
        public: () => {
            if (routes.length < 0) {
                return builder
            }
            routes[routes.length - 1].authenticationRequired = false
            return builder
        },
        build: () => {
            const router = Router()
            for (const route of routes) {
                if (route.authenticationRequired) {
                    router[route.method](
                        route.path,
                        authenticate,
                        route.handler
                    )
                } else {
                    router[route.method](route.path, route.handler)
                }
            }
            return router
        },
    }
    return builder
}
