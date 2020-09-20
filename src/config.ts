import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

interface Config {
    NODE_ENV: String,
    PORT: Number
}

const config: Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000
}

export const { PORT, NODE_ENV } = config
