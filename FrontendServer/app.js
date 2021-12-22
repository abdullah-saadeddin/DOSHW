const express = require('express');
const path = require("path")
const cors = require('cors');
const app = express() ;
const axios = require("axios");
let catlogIP = ["http://192.168.139.133:3003","http://192.168.139.131:3003"]
let orderIP = ["http://192.168.139.133:3005","http://192.168.139.131:3005"]
let catCur = 0
let orCur = 0
require('dotenv').config()
app.use(cors());
app.use(express.json());

const collection = new Map();
let cashMid = (req, res, next)=>{
    
    
    if(collection.has(req.headers["topic"] + req.url))
    {
        res.send(collection.get(req.headers["topic"] + req.url)) 
        return
    }
    if(collection.has(req.headers["itemnumber"] + req.url))
    {
        res.send(collection.get(req.headers["itemnumber"] + req.url)) 
        return
    }
    else
    {
        next()
    }

}


app.get("/search",cashMid,(req,res)=>{
    let subject = req.headers["topic"]

    axios.get(catlogIP[catCur]+'/getbook/subject',{headers:{subject}})
        .then((ress)=> {
            collection.set(req.headers["topic"] + req.url,ress.data)
            catCur = (catCur + 1) % catlogIP.length;
           res.send(ress.data)
           
        })
        .catch( (error) =>{
            res.sendStatus(500)
            console.log(error);
        })
})

app.get("/info",(req,res)=>{
    let itemnumber = req.headers["itemnumber"]
    axios.get(catlogIP[catCur]+'/getbook/itemNumber',{headers:{itemnumber}})
        .then((ress)=> {
            collection.set(req.headers["itemnumber"] + req.url,ress.data[0])
            catCur = (catCur + 1) % catlogIP.length;
           res.send(ress.data[0])
        })
        .catch( (error) =>{
            res.sendStatus(500)
            console.log(error);
        })
})

app.post("/purchase/:itemnumber",async(req,res)=>{
    let itemNumber = req.params.itemnumber
    let data = []
    axios.post(orderIP[orCur]+'/purchase/'+itemNumber)
        .then((ress)=> {
            collection.clear()
            orCur = (orCur + 1) % orderIP.length;
           res.sendStatus(200)
        })
        .catch( (error) =>{
            console.log(error);
        })
})
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
  });