const jwt = require("jsonwebtoken");
const userSchema = require("../model/userSchema");

const authentication = async (req,res,next)=>{
    try{
        const tokens= await req.headers.cookie;
        if(tokens){
            const token=tokens && tokens.split('=')[1];
            const verifyToken = await jwt.verify(token, process.env.SECRET_KEY)
            
            const rootUser = await userSchema.findOne({_id: verifyToken._id, "tokens.token": token})
    
            if(!rootUser){
                throw new Error('User not Found');
            }
            req.token=token;
            req.rootUser=rootUser;
            req._id=rootUser._id;
            next();
        }
        else 
        next();
    }catch(err){
        res.status(401).send("The client request has not been completed because it lacks valid authentication credentials for the requested resource")
        console.log(err);
    }
    // next();
}

module.exports = authentication;