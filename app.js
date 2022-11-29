const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
dotenv.config({path: './.env'});
require('./db/conn');
const port = process.env.PORT;
const User =  require('./model/userSchema');
app.use(express.json());
app.use(require('./router/auth'));

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());


// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
//   }



app.get('/', (req,res) => {
    res.send(`this is from node express server home page`)
});

// app.get('/about', (req,res,next) => {
//     res.send("this is from node express server About page ");
//     console.log('Request Type1:', req.method);
//     next();
// });

// app.get('/contact', (req,res) => {
//     // res.cookie("Test", "thapa");
//     res.send("this is from node express server Contact page ")
// });

app.get('/signin', (req,res) => {
    res.send("this is from node express server sign in page ")
});

app.get('/signup', (req,res) => {
    res.send("this is from node express server sign up page ")
});

app.listen(port, () => {
    console.log(`node express server active now ${port}`)
});

