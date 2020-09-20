import { Server } from 'restify'

import postsRoute from './posts'

export default (server:Server) => {
    postsRoute(server)
}
