import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app= express();

const PORT = 5000;
app.get("/health",(req,res)=>{
    return res.send("working...")
})
app.listen(PORT , ()=>{
    console.log("server is working at localhost:5000")
})