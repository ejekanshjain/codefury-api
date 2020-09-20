import mongoose from 'mongoose'

import { MONGODB_URL } from '../config'
import logger from '../util/logger'

mongoose
    .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => {
        logger.log(err)
        process.exit(1)
    })

export default mongoose.connection
