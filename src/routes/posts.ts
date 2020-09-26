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
                                        path: [
                                            { value: 'title', multi: 'keywordAnalyzer' },
                                            { value: 'tags', multi: 'keywordAnalyzer' },
                                            { value: 'summary', multi: 'keywordAnalyzer' },
                                            'title',
                                            'tags',
                                            'summary'
                                        ]
                                    }
                                }
                            },
                            {
                                $limit: 20
                            },
                            {
                                $project: {
                                    id: 1,
                                    title: 1,
                                    summary: 1,
                                    tags: 1,
                                    createdAt: 1
                                }
                            }
                        ])
                    }
                })
            } else {
                res.send({ data: { posts: await Post.find({}, { id: 1, title: 1, summary: 1, tags: 1, createdAt: 1 }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit) } })
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
            // TODO creator id by jwt and also cover image
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
