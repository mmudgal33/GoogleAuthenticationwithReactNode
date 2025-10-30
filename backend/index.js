// node --watch ./index.js

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

require('./models/dbConnect');
const authRoutes = require('./routes/authRoutes');
const commentController = require('./controllers/commentController');
const descriptionController = require('./controllers/descriptionController');

const PORT = process.env.PORT || 8080;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(cors());
app.use('/auth/', authRoutes); // <- NEW LINE
app.use('/comment', commentController)
app.use('/description', descriptionController)

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
// });

app.all('/*splat', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

  