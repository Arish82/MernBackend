const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.pre('save', function(next){
    if(this.isModified('password')){
        var salt = bcrypt.genSaltSync(10);
        this.password= bcrypt.hashSync(this.password, salt);
        this.confirmPassword= bcrypt.hashSync(this.confirmPassword, salt);
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
};

userSchema.methods.addMessage = async function(name, email, phone,message){
    try{
        this.messages = this.messages.concat({name, email, phone,message})
        await this.save();
        return this.messages;
    }catch(err){
        console.log(err);
    }
}

const User = new mongoose.model('USER',userSchema);

module.exports = User;