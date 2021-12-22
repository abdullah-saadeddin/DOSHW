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
    try
    {
        let subject = req.headers["subject"]
        l.log("serach for the books with subject: " + subject )
        let result = await knex("items").select().where("topic",subject)
        if(result.length == 0)
        {
            res.json({"result":"there is no book in this subject"})
        }
        l.log("the result is: " + JSON.stringify(result))
        res.json(result)
    }
    catch(e)
    {
        res.status(500).send("error parsing your req. in server")
    }

})

app.get("/getbook/itemNumber",async(req,res)=>{

    try
    {
        let itemNumber = req.headers["itemnumber"]
        l.log("serach for the book with item number: " + itemnumber )
        console.log(itemNumber)
        let result = await knex("items").select().where("number",itemNumber)
        if(result.length == 0)
        {
            res.json({"result":"there is no book with this item number"})
        }
        l.log("the result is: " + JSON.stringify(result))
        res.json(result)
    }
    catch(e)
    {
        res.status(500).send("error parsing your req. in server")
    }

})

app.put("/updatebook/stock",async(req,res)=>{
    
    try 
    {
        let opration = req.headers["opration"]
        let amount = req.headers["amount"]
        let itemNumber = req.headers["itemnumber"]
        l.log("update item: "+ itemNumber + " stock by: " + opration + " the amount to: " + amount)
        
        let result = await knex("items").select().where("number",itemNumber)
        if(result.length == 0)
        {
            res.json({"result":"there is no book with this item number to update"})
        }
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
    } 
    catch (error) 
    {
        res.status(500).send("error parsing your req. in server")
    }

 
})

app.put("/updatebook/cost",async(req,res)=>{
    
    try
    {
        let newcost = parseInt(req.headers["newcost"])
        let itemNumber = req.headers["itemnumber"]  
        let result = await knex("items").select().where("number",itemNumber)
        if(result.length == 0)
        {
            res.json({"result":"there is no book with this item number to update"})
        }
        l.log("update the book number: " + itemNumber + " cost to: " + newcost)
        let updateResult = await knex('items').update('cost',newcost).where("number",itemNumber)
        l.log("updated Succsfully")
        res.sendStatus(200) 
    }
    catch(e)
    {
        res.status(500).send("error parsing your req. in server")
    }

})

app.listen(process.env.PORT, ()=>{
    l.log(`server is running on port ${process.env.PORT}`);
  });