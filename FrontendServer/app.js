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
const l = require("../looger.js")

const collection = new Map();
let cashMid = (req, res, next)=>{
    
    l.log("--------------------------")
    if(collection.has(req.headers["topic"] + req.url))
    {
        l.log("requset founded in the cash")
        res.send(collection.get(req.headers["topic"] + req.url)) 
        return
    }
    if(collection.has(req.headers["itemnumber"] + req.url))
    {
        l.log("requset founded in the cash")
        res.send(collection.get(req.headers["itemnumber"] + req.url)) 
        return
    }
    else
    {
        l.info("requset Not founded in the cash")
        next()
    }

}


app.get("/search",cashMid,(req,res)=>{
    let subject = req.headers["topic"]
    l.log("Serach query for books of topic: "+subject)
    l.log("Serch in server :" + catlogIP[catCur] )
    axios.get(catlogIP[catCur]+'/getbook/subject',{headers:{subject}})
        .then((ress)=> {
            collection.set(req.headers["topic"] + req.url,ress.data)
            catCur = (catCur + 1) % catlogIP.length;
            l.log("Serch Results is : " + JSON.stringify(ress.data) )
           res.send(ress.data)
           
        })
        .catch( (error) =>{
            res.sendStatus(500)
            l.error("there is an error accour in the server")
            l.error(error.stack)  
            res.status(500).send("error parsing your req. in server")
        })
})

app.get("/info",cashMid,(req,res)=>{
    let itemnumber = req.headers["itemnumber"]
    l.log("serch for the book with the item number : " + itemnumber)
    l.log("Serch in server :" + catlogIP[catCur] )
    axios.get(catlogIP[catCur]+'/getbook/itemNumber',{headers:{itemnumber}})
        .then((ress)=> {
            l.log(JSON.stringify(ress))
            collection.set(req.headers["itemnumber"] + req.url,ress.data[0])
            catCur = (catCur + 1) % catlogIP.length;
            l.log("the book is: ",JSON.stringify(ress.data[0]) )
           res.send(ress.data[0])
        })
        .catch( (error) =>{
            
            l.error("there is an error accour in the server")
            l.error(error.stack) 
            
        })
})

app.post("/purchase/:itemnumber",async(req,res)=>{
    l.log("--------------------------")
    let itemNumber = req.params.itemnumber
    let data = []
    l.log("Place a new order to buy book number: " + itemNumber)
    l.log("order in server :" + orderIP[orCur] )
    axios.post(orderIP[orCur]+'/purchase/'+itemNumber)
        .then((ress)=> {
            collection.clear()
            orCur = (orCur + 1) % orderIP.length;
            l.log("the item get paod succsfuly")
           res.send(ress.data)
        })
        .catch( (error) =>{
            l.error("there is an error accour in the server")
            l.error(error.stack)  
            res.status(500).send("error parsing your req. in server")
        })
})
app.listen(process.env.PORT, ()=>{
    l.log(`server is running on port ${process.env.PORT}`);
  });