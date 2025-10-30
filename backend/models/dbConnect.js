const mongoose = require('mongoose');

// const DB = process.env.DB_URL;
const DB = process.env.mongo_url;
console.log('DB--', DB);
mongoose
    .connect(DB)
    .then(() => {
        console.log('DB connection established');
    })
    .catch((err) => {
        console.log('DB CONNECTION FAILED');
        console.log('ERR: ', err);
    });



// connect our db

// mongoose.set('strictQuery', false)
// mongoose.connect(process.env.mongo_url, () => console.log('DB is successfully connected'))

// mongo_url="mongodb://127.0.0.1:27017/foodOrderingApp";
// mongoose.connect(mongo_url, () => console.log('DB is successfully connected'))




// mongoose.set('strictQuery', false)
// mongoose.connect('mongodb://localhost:27017/googleauth')
//     .then(() => console.log('connection successful'))
//     .catch((err) => console.log(err));