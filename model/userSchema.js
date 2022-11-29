const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requried:true
    },
    email: {
        type: String,
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    work: {
        type: String,
        required:true
    },
    password: {
        type:String,
        requied:true,
    },
    cpassword: {
        type:String,
        requied:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
                name: {
                    type: String,
                    requried:true
                },
                email: {
                    type: String,
                    required:true
                },
                phone: {
                    type: Number,
                    required:true
                },
                message: {
                    type: String,
                    required:true
                },
        }
    ],
    tokens: [
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});
   

// generating token

// userSchema.statics.generateAuthToken  this is without instense

userSchema.methods.generateAuthToken = async function(){
    try{
        // let tokengen = jwt.sign({_id:this._id}) like this before javascript es6
        let tokengen = jwt.sign({ _id:this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: tokengen});
        await this.save();
        return tokengen;
    }catch(err){
        console.log(err);
    }
};


// storing the messages

userSchema.methods.addMessage = async function(name,email,phone,message){
    try{
        this.messages = this.messages.concat({name,email,phone,message});//key value are same
        await this.save();
        return this.messages;
    }catch(error){
        console.log(error);
    }
}


//hashing the password like this with new method

userSchema.pre('save', async function(next){
    console.log(`hi from password bcrypt testing inside`);
    if(this.isModified('password')){
        const rounds = 12;
        const hash = await bcrypt.hash(this.password, rounds);
        const hashc = await bcrypt.hash(this.cpassword, rounds);
        this.password = hash;
        this.cpassword = hashc;
        // this.password = bcrypt.hash(this.password, 10);
        // this.cpassword = bcrypt.hash(this.cpassword, 10);
    }
    next();
});

/* 

        // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
  });


try {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword; 

        console.log(user);
        */

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
//});



const User = mongoose.model('USER', userSchema);

module.exports = User;