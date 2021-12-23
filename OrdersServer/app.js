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
const l = require("./looger")

const otherIP = "http://" + process.env.repIP +":"
const myIP = "http://" + process.env.myIP +":"
app.get("/",(req,res)=>{
    res.sendStatus(200)
})

app.post("/purchase/:itemnumber",async(req,res)=>{

    let itemNumber = req.params.itemnumber
    let data = []
    let d = {}
    l.log("new order to buy item: " + itemNumber)
   
    
    axios.get(otherIP+"3003"+'/getbook/itemNumber',{headers:{"itemnumber":itemNumber}})
        .then((ress)=> {
            l.log("item data is: " + JSON.stringify(ress.data))
            let itemData = ress.data
            if(ress.data.result)
            {
                res.json({"result":"there is no book with this item number"})
            }
            if(itemData != {})
            {
                l.log(parseInt(itemData[0].stock) - 1)
                l.log(parseInt(itemData[0].stock) )
                if(parseInt(itemData[0].stock) - 1 < 0)
                {
                    res.send("there is no items in the stock")
                }
                else
                {
                    axios.put(myIP+"3003"+'/updatebook/stock',data,{headers:{"opration":"decrease","itemnumber":itemNumber,"amount":1}})
                    .then(async(resp)=>{
                        axios.put(otherIP+"3003"+'/updatebook/stock',data,{headers:{"opration":"decrease","itemnumber":itemNumber,"amount":1}}).then(async(ressss)=>{
                            l.log("update the stock of the item")
                            let result = await knex("orders").insert({"date":new Date(),"itemNumber":itemNumber})
                            l.log("result of update: " + resp.data)
                            res.sendStatus(200)
                        })
             
                    })
                }
            
            }
        })
        .catch( (error) =>{
            l.error("error in finding the item")
        })
})

app.listen(process.env.PORT, ()=>{
    l.log(`server is running on port ${process.env.PORT}`);
  });