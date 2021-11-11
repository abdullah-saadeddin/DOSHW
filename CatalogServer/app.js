const express = require('express');
const path = require("path")
const cors = require('cors');
const app = express() ;
require('dotenv').config()
app.use(cors());
app.use(express.json());

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
    console.log(subject)
    let result = await knex("items").select().where("topic",subject)
    res.json(result)
})

app.get("/getbook/itemNumber",(req,res)=>{

})

app.put("/updatebook/stock",(req,res)=>{

})

app.put("/updatebook/cost",(req,res)=>{

})

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
  });