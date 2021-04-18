import { Socket } from "socket.io"


export type SocketHandlerFunction<T> = (arg: T & {socket: Socket }) => Promise<void>

export type SocketMiddleware = (input: {socket: Socket, next: (error?: any) => void }) => Promise<void>


export type SocketEventHandler = {
    event: string
    handler: SocketHandlerFunction<any>,
}


export interface SocketGatewayConfig {

    socketEventHandlers: SocketEventHandler[]
    middlewares: SocketMiddleware[]
}



export const createSocketGateway = () => {


    const socketGatewayConfig: SocketGatewayConfig = {
        middlewares: [],
        socketEventHandlers: []
    }

    const builder = {
        withSocketHandler: <T>(event: string, handler: SocketHandlerFunction<T>) => {
            socketGatewayConfig.socketEventHandlers.push({
                event,
                handler,
            })
            return builder
        },
        withMiddleware: ((middleware: SocketMiddleware) => {
             socketGatewayConfig.middlewares.push(middleware)
             return builder
        }),
        build: () => socketGatewayConfig,
    }
    return builder


}