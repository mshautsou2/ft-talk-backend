import ioserver, { Socket } from 'socket.io'

import { Express } from 'express'
import { Server } from 'http'
import { User } from '@shared/functions/users/models/user.model'
import { decodeToken } from './jwt.utils'
import { AuthInfo } from './authenticator'
import { getDBManager } from 'src/config/database-connection'
import { ensureUserAuthorizedToAccessChat } from 'src/modules/messages/_helper/permission.helper'
import { SocketGatewayConfig } from 'src/libs/socket-gateway.builder'

export function createSocketIOServer(server: Server, gatewayConfigs: SocketGatewayConfig[]) {
    // @ts-ignore
    const io = ioserver(server, {
        cors: '*',
    })
    initIOServer(io, gatewayConfigs)
    return io
}
// https://stackoverflow.com/questions/54661656/why-did-the-socket-io-clients-resend-offline-messages-when-reconnect-succcess

function initIOServer(ioServer: ioserver.Server, gatewayConfigs: SocketGatewayConfig[]) {

    for (const gatewayConfig of gatewayConfigs) {
        for (const middleware of gatewayConfig.middlewares) {
            ioServer.use((socket, next) => middleware({ socket, next}))
        }
    }

    ioServer.on('connection', (socket) => {

        for (const gatewayConfig of gatewayConfigs) {
            for (const eventHandler of gatewayConfig.socketEventHandlers) {
                socket.on(eventHandler.event, (arg: any) => eventHandler.handler({...arg, socket }))
            }
        }
    })


}
