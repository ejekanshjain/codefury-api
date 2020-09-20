import { Server } from 'restify'

export default (server:Server) => {
    server.get('/', (req, res, next) => {
        res.send('Hello, World!')
        next()
    })
}
