import { Connection, createConnection } from 'typeorm'

let databaseConnection: Connection
createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'fluid-talk',
    entities: [__dirname + '/../modules/**/*.model.ts'],
    synchronize: true,
    logging: true,
})
    .then((connection) => {
        databaseConnection = connection
        console.log('connected to datbase!')
    })
    .catch(console.log)

export const getDatabaseConnection = () => databaseConnection
export const getDBManager = () => databaseConnection.manager
