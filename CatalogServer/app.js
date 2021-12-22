const express = require('express');
const path = require("path")
const cors = require('cors');
const e = require('express');
const app = express() ;
require('dotenv').config()
app.use(cors());
app.use(express.json());
const l = require("../looger")
const axios = require("axios")
const knex = require("knex")({
    client: "sqlite",
    connection: {
        filename: path.join(__dirname, './items.db')
    },
    useNullAsDefault: true
});

app.get("/",(req,res)=>{
    res.sendStatus(200)
})

app.get("/getbook/subject",async(req,res)=>{

    let subject = req.headers["subject"]
    l.log("serach for the books with subject: " + subject )
    let result = await knex("items").select().where("topic",subject)
    l.log("the result is: " + JSON.stringify(result))
    res.json(result)
})

app.get("/getbook/itemNumber",async(req,res)=>{

    let itemNumber = req.headers["itemnumber"]
    l.log("serach for the book with item number: " + itemnumber )
    console.log(itemNumber)
    let result = await knex("items").select().where("number",itemNumber)
    l.log("the result is: " + JSON.stringify(result))
    res.json(result)
})

app.put("/updatebook/stock",async(req,res)=>{
 
        let opration = req.headers["opration"]
        let amount = req.headers["amount"]
        let itemNumber = req.headers["itemnumber"]
        l.log("update item: "+ itemNumber + " stock by: " + opration + " the amount to: " + amount)
        
        let result = await knex("items").select().where("number",itemNumber)
        let newVal 
        if(opration == "increase")
        {
            newVal = parseInt(result[0]["stock"]) + parseInt(amount)
            
        }
        else 
        {
            newVal = parseInt(result[0]["stock"]) - parseInt(amount)
        }
        l.log("the new Value is: " + newVal)
        let updateResult = await knex('items').update('stock',newVal).where("number",itemNumber)
        l.log("updated Succsfully")
        res.sendStatus(200) 
 
})

app.put("/updatebook/cost",async(req,res)=>{
    
    let newcost = parseInt(req.headers["newcost"])
    let itemNumber = req.headers["itemnumber"]  
    l.log("update the book number: " + itemNumber + " cost to: " + newcost)
    let updateResult = await knex('items').update('cost',newcost).where("number",itemNumber)
    l.log("updated Succsfully")
    res.sendStatus(200) 
})

app.listen(process.env.PORT, ()=>{
    l.log(`server is running on port ${process.env.PORT}`);
  });