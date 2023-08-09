const mongoose = require('mongoose');
const DB = process.env.DATABASE;


mongoose.connect(DB).then(() => {
    console.log("connection Sucessful");
}).catch((err) => {
    console.log("failed DB connect")
})