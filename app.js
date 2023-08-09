const express=require("express");
const app=express();

const dotenv= require("dotenv")
dotenv.config({path: './db/.env'});
const PORT=process.env.PORT || 8000;

require("./db/conn")

app.use(express.json())
app.use(require("./router/auth"))

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

