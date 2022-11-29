const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Database
const DB = process.env.DATABASE;

// console.log(DB);
mongoose.connect( DB ,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify:false
}).then(() => {
    console.log('Mongo atlas Connection successful')
}).catch((err) => console.log(err));



