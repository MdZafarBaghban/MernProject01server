const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");

const cookieParser = require('cookie-parser');
router.use(cookieParser());

// require('../db/conn');
const User = require('../model/userSchema');



router.post('/register', async (req,res) => {

    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "Please fill all the field properly"});
    }

    try{
        const userExist = await User.findOne({email: email});

        if (userExist) {
            return res.status(422).json({error: "The Email You have entered this is already Exist try another one "})
        } else if (password != cpassword){
            return res.status(422).json({error:"password are not matching"})
        } else {
            const user = new User({name , email , phone , work , password , cpassword });
            const userRegister = await user.save();
            console.log(`${user} user Registered successfully`);
            console.log(userRegister);
            res.status(201).json({message: "user registered Successfully "});
        }
 
        // if (userRegister){
        //     res.status(201).json({message: "user registered Successfully "});
        // }else{
        //     res.status(500).json({error: "Failed to registered"});
        // }

    }catch(err){
        console.log(err);
    }
});


// Login post for clint

router.post('/signin', async (req, res) => {

    // console.log(req.body);
    // res.json({message: "awesome like this "});

    try{
        // let token ;
        const  {email , password } = req.body;

        if (!email || !password){
            return res.status(400).json({error: "Please Fill all the data carefully"});
        }
        const userLogin = await User.findOne({email: email});

        console.log(userLogin);
        if(userLogin){
                const isMatch = await bcrypt.compare(password, userLogin.password);
                let tokengen = await userLogin.generateAuthToken();
                console.log(tokengen);

                //cookie saving to browser
                res.cookie('jwtoken', tokengen, {
                    expires:new Date(Date.now() + 2589200000),
                    //secure:true,//added
                    httpOnly:true,
                    // secure: process.env.NODE_ENV === "production",
                })
                // .status(200)
                // .json({ message: "Logged in successfully" });
                
                if(!isMatch){
                    res.json({error: "User Error Invalid password "});
                }else {
                    res.json({message: "User signin successfully 😊 👌 "});
                }
        }else{
            res.status(400).json({error: "Invalid Credentials "})
        }
        /* 
        const isMatch = await bcrypt.compare(password, userLogin.password)
        if(!isMatch){
            res.json({error: "User Error Invalid Credentials "});
        }else {
            res.json({message: "User signin successfully "});
        }
        */
    }catch(err){console.log(err);
    }
});
// About page verifying the token with jwt 
router.get('/about', authenticate , (req ,res) => {
    console.log("Hello from about page from auth SERVER");
    // res.send(`Hello About World From the server`);
    res.send(req.rootUser);
});

// get user data for contact us and home page
router.get('/getdata' , authenticate, (req, res) => {
    console.log("Hello From Contact And Home Dynamic");
    res.send(req.rootUser);
});

router.post('/contact', authenticate , async (req,res) => {
    try{
        const {name , email , phone , message} = req.body;
        if(!name || !email || !phone || !message){
            console.log("error in Contact form ");
            return res.json({error: "Please Fill All The Contact Form"});
        }

        const userContact = await User.findOne({_id:req.userID});

        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);

            await userContact.save();

            res.status(201).json({message:"User Contact Successfully"});
        }
    }catch(err){
        console.log(err);
    }
});

// Logout route/Page
router.get('/logout', (req ,res) => {
    console.log("Hello from Logout page from auth SERVER");
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send('User Logout');
});


module.exports = router ;
