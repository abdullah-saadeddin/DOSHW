const express = require('express');
const path = require("path")
const cors = require('cors');
const app = express() ;
const axios = require("axios")
require('dotenv').config()
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.sendStatus(200)
})


app.get("/search",(req,res)=>{
    let subject = req.headers["topic"]
    axios.get(process.env.Catalog_HOST+'/getbook/subject',{headers:{subject}})
        .then((ress)=> {
           res.send(ress.data)
        })
        .catch( (error) =>{
            res.sendStatus(500)
            console.log(error);
        })
})

app.get("/info",(req,res)=>{
    let itemnumber = req.headers["itemnumber"]
    axios.get(process.env.Catalog_HOST+'/getbook/itemNumber',{headers:{itemnumber}})
        .then((ress)=> {
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
    axios.post(process.env.ORDER_HOST+'/purchase/'+itemNumber)
        .then((ress)=> {
           res.sendStatus(200)
        })
        .catch( (error) =>{
            console.log(error);
        })
})
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
  });