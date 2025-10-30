

const commentController = require('express').Router()
const Comment = require('../models/commentsModel')



// register comments
commentController.post('/', async (req, res) => {

    try {
      const comment = req.body;
      console.log('comment ', comment);
  
      const newComment = await Comment.create({ ...req.body })
      return res.status(201).json({ newComment })
    } 
    catch (error) {
      return res.status(500).json(error.message)
    }
  })

  module.exports = commentController

  