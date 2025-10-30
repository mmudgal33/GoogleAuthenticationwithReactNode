
const descriptionController = require('express').Router()
const Description = require('../models/descriptionModel')



// register description
descriptionController.post('/', async (req, res) => {

    try {
      const description = req.body;
      console.log('description ', description);
  
      const newDescription = await Description.create({ ...req.body })
      return res.status(201).json({ newDescription })
    } 
    catch (error) {
      return res.status(500).json(error.message)
    }
  })

  module.exports = descriptionController