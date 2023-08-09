const mongoose = require('mongoose');
// const DB = process.env.DATABASE;
const DB = "mongodb+srv://newArish:Arish%40123@cluster0.hggc0rs.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(DB).then(() => {
    console.log("connection Sucessful");
}).catch((err) => {
    console.log("failed DB connect")
})