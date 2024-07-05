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

server.post('/api/posts/', (req, res) => {
    const postBody = req.body
    if(!postBody.title || !postBody.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }else{
        Posts.insert(postBody)
            .then(newPost => {
                const joinObjects = Object.assign({}, newPost, postBody)
                res.status(201).json(joinObjects)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})

server.put('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(updatePost => {
            if(!updatePost){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }else{
                const bodyFromReq = req.body
                if(!bodyFromReq.title || !bodyFromReq.contents){
                    res.status(400).json({
                        message: "Please provide title and contents for the post",
                    })
                }else{
                    const updatedPost = {
                        ...updatePost,
                        ...bodyFromReq
                    };
                    Posts.update(updatePost.id, bodyFromReq)
                        .then(() => {
                            res.status(200).json(updatedPost);
                        })
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be modified",
                err: err.message,
                stack: err.stack
            })
        })    
})

server.delete('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(postToDelete => {
            if (!postToDelete) {
                return res.status(404).json({
                    message: "The post with the specified ID does not exist"
                });
            } else {
                Posts.remove(req.params.id)
                    .then(() => {
                        res.status(200).json(postToDelete);
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: "There was an error while deleting the post from the database",
                            error: error.message
                        });
                    });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "There was an error retrieving the post",
                error: error.message
            });
        });
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

module.exports = server
