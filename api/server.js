const express = require('express')
const Posts = require('./posts/posts-model')
const server = express()

server.use(express.json())

server.get('/api/posts', (req, res) => {
    Posts.find()
        .then(postForPage => {
            res.json(postForPage)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

server.get('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(postForPage => {
            if(!postForPage){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }else{
                res.json(postForPage)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

server.get('/api/posts/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(findComment => {
            if(findComment.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }else{
                res.json(findComment)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The comments information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

module.exports = server
