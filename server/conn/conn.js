const mongoose = require("mongoose");
require('dotenv').config()

const conn = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log("Connected ");
        });
    } catch (error) {
        res.status(400).json({
            message: "Not Connected",
        });
    }
};
conn();