import { Server } from 'restify'
import { InternalError, BadRequestError, ResourceNotFoundError } from 'restify-errors'

import Post from '../models/Post'
import logger from '../util/logger'

export default (server: Server) => {
    server.get('/posts', async (req, res, next) => {
        try {
            const gotPage = Number(req.query.page) || 1
            const gotLimit = Number(req.query.limit) || 10
            const page = (gotPage >= 1 && gotPage <= 1000) ? gotPage : 1
            const limit = (gotLimit >= 1 && gotPage <= 1000) ? gotLimit : 10
            if (req.query.search) {
                res.send({
                    data: {
                        posts: await Post.aggregate([
                            {
                                $search: {
                                    text: {
                                        query: req.query.search,
                                        path: ['title', 'tags', 'summary']
                                    }
                                }
                            },
                            {
                                $limit: 20
                            }
                        ])
                    }
                })
            } else {
                res.send({ data: { posts: await Post.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit) } })
            }
            next()
        } catch (err) {
            logger.log(err)
            return next(new InternalError('Something Went Wrong!'))
        }
    })

    server.get('/posts/:id', async (req, res, next) => {
        try {
            const post = await Post.findOne({ id: req.params.id })
            if (!post) return next(new ResourceNotFoundError('Post not found!'))
            res.send({ data: { post } })
            next()
        } catch (err) {
            logger.log(err)
            return next(new InternalError('Something Went Wrong!'))
        }
    })

    server.post('/posts', async (req, res, next) => {
        try {
            const { title, summary, content, tags } = req.body
            const creator = '5f67252e0a6eff373d69570b'
            await Post.create({
                id: title.toLowerCase().split(' ').join('-'),
                title,
                summary,
                content,
                tags,
                creator
            })
            res.send(201)
            next()
        } catch (err) {
            if (err.code === 11000) return next(new BadRequestError('Post already exists!'))
            logger.log(err)
            return next(new InternalError('Something Went Wrong!'))
        }
    })

    server.patch('/posts/:id', async (req, res, next) => {
        try {
            const { title, summary, content, tags } = req.body
            await Post.updateOne({ id: req.params.id }, { title, summary, content, tags })
            res.send(200)
            next()
        } catch (err) {
            logger.log(err)
            return next(new InternalError('Something Went Wrong!'))
        }
    })

    server.del('/posts/:id', async (req, res, next) => {
        try {
            await Post.deleteOne({ id: req.params.id })
            res.send(204)
            next()
        } catch (err) {
            logger.log(err)
            return next(new InternalError('Something Went Wrong!'))
        }
    })
}
