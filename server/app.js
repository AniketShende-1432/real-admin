const express = require("express");
const app = express();
const cors =require("cors");
require("./conn/conn");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const login = require("./routes/login");

app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());

app.use("/api/v1", login);

app.listen(process.env.PORT,()=>{
    console.log("Server Started");
});