const express = require('express');
const path = require("path")
const cors = require('cors');
const app = express() ;
require('dotenv').config()
app.use(cors());
app.use(express.json());
const axios = require("axios")
const knex = require("knex")({
    client: "sqlite",
    connection: {
        filename: path.join(__dirname, './orders.db')
    },
    useNullAsDefault: true
});
const l = require("../looger")

app.get("/",(req,res)=>{
    res.sendStatus(200)
})

app.post("/purchase/:itemnumber",async(req,res)=>{
    let itemNumber = req.params.itemnumber
    let data = []
    l.log("new order to buy item: " + itemNumber)
    axios.get(process.env.HOST+'/getbook/itemNumber',{headers:{"itemnumber":itemNumber}})
        .then((ress)=> {
            l.log("item data is: " + JSON.stringify(ress.data))
            let itemData = ress.data
            if(itemData != {})
            {
                axios.put(process.env.HOST+'/updatebook/stock',data,{headers:{"opration":"decrease","itemnumber":itemNumber,"amount":1}})
                .then(async(resp)=>{
                    l.log("update the stock of the item")
                    let result = await knex("orders").insert({"date":new Date(),"itemNumber":itemNumber})
                    l.log("result of update: " + resp.data)
                    res.sendStatus(200)
                })
            }
        })
        .catch( (error) =>{
            l.error("error in finding the item")
        })
})

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
  });