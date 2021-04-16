import { createLogger, transports } from "winston";

export const logger = createLogger({
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' })
    ]
});