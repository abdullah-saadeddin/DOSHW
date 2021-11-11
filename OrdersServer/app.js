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

app.post("/purchase/:itemnumber",async(req,res)=>{
    let itemNumber = req.params.itemnumber
    let data = []
    axios.get(process.env.HOST+'/getbook/itemNumber',{headers:{"itemnumber":itemNumber}})
        .then((res)=> {
            let itemData = res.data
            if(itemData != {})
            {
                axios.put(process.env.HOST+'/updatebook/stock',data,{headers:{"opration":"decrease","itemnumber":itemNumber,"amount":1}})
            }
        })
        .catch( (error) =>{
            console.log(error);
        })
})

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
  });