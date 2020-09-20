import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

interface Config {
    NODE_ENV: String,
    PORT: Number,
    MONGODB_URL: string
}

const config: Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017'
}

export const { PORT, NODE_ENV, MONGODB_URL } = config
