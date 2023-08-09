const express=require('express')
const router=express.Router();
require('../db/conn');
const User=require("../model/userSchema")
const bcrypt= require("bcryptjs");
const jwt = require('jsonwebtoken');
const authentication = require("../middleware/authentication")

router.get('/',(req,res)=>{
    res.send("Arish from router.js")
})

// promises
// router.post("/register",(req,res)=>{
//     const {name, email, phone, work, password, confirmPassword}=req.body;
    
//     if(!name || !email || !phone || !work || !password || !confirmPassword){
//         return res.status(422).json({message: "Unprocessable Entity! Make sure that the data sent in the request contains all valid fields and values beforehand."})
//     }
    
//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({message: "Email already Exist"})
//         }
//         const user= new User({name, email, phone, work, password, confirmPassword})

//         user.save()
//         .then(()=> {
//             res.status(201).json({message: "User created"})
//         })
//         .catch(()=> res.status(500).json({message: "Failed to register"}))
//     }).catch(err=> console.log(err))

// })

router.post("/register",async (req,res)=>{
    const {name, email, phone, work, password, confirmPassword}=req.body;
    
    if(!name || !email || !phone || !work || !password || !confirmPassword){
        return res.status(422).json({message: "Unprocessable Entity! Make sure that the data sent in the request contains all valid fields and values beforehand."})
    }
    
    try{
        const userExist = await User.findOne({email:email});

        if(userExist){
            return res.status(422).json({message: "Email already Exist"})
        }
        else if(password!==confirmPassword){
            return res.status(422).json({message: "Password and confirm Passwaord don't match"})
        }

        const user = new User({name, email, phone, work, password, confirmPassword});
        const created= await user.save();

        if(created){
            res.status(201).json({message: "User created"})
        }
        else{
            res.status(500).json({message: "Failed to register"})
        }
    } catch (err){
        console.log(err);
    }


})

router.post("/login",async (req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Fill data coompletly"});
        }

        const exist= await User.findOne({email: email});
        
        if(!exist){
            return res.status(400).json({error: "Invalid Credentials"});
        }
        else{
            const pssMatch= await bcrypt.compare(password, exist.password);
            if(pssMatch)
            {
                const token= await exist.generateAuthToken();
                res.cookie("jwtoken", token,{
                    // expires: new Date(Date.now()+200000),
                    httpOnly: true
                })
                return res.status(200).json({message: "user login successfully"});
            }
            else
                return res.status(400).json({error: "Invalid Credentials"});
        }

    }catch(err){
        console.log(err);
    }
} )

router.get("/aboutme", authentication, (req,res)=>{
    res.send(req.rootUser)
})

router.get("/getdata", authentication, (req,res)=>{
    res.send(req.rootUser)
})

router.post("/contact", authentication, async (req,res)=>{
    try{
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            return res.status(422).send({message: "Fill the form correctly"})
        }
    
        const userContact = await User.findOne({_id: req._id});
        console.log("Arish", userContact);
        if(userContact){
            const userMsg= await userContact.addMessage(name, email, phone, message);
            await userContact.save();
            res.status(201).json({message: "Message saved"})
        }

    }catch(err){
        console.log(err);
    }
})

router.get("/logout", (req,res)=>{
    res.clearCookie("jwtoken", {path: "/"});
    res.status(200).json({message: "User logout success"})
})

module.exports=router;