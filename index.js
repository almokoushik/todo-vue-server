const express=require("express");
require('dotenv').config()
const cors = require('cors')
const { ObjectID, ObjectId } = require("bson");
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kar2i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const PORT=process.env.PORT

const app = express()
app.use(express());
app.use(cors())
app.use(express.json())


client.connect(err => {
    if(err){
        console.log(err)
        return
    }
    else{
        const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION1);
        // perform actions on the collection object
        try{
            app.get("/",(req,res)=>{
                try{
                    collection.find({}).toArray()
                    .then(result=>{
                        try{
                            if(result.length!=0){
                                res.send(result)
                            }
                        }
                        catch(err){
                            console.log(err)
                            res.send(err)
                        }
                    })
                    .catch(err=>console.log(err))

                }
                catch(err){
                    res.send("Something went Wrong")
                    console.log("Something went Wrong")
                }
            })

            app.get("/incomplete", (req, res) => {
                try {
                    collection.find({"status":"incomplete"}).toArray()
                        .then(result => {
                            try {
                                if (result.length != 0) {
                                    res.send(result)
                                }
                            }
                            catch (err) {
                                console.log(err)
                                res.send(err)
                            }
                        })
                        .catch(err => console.log(err))

                }
                catch (err) {
                    res.send("Something went Wrong")
                    console.log("Something went Wrong")
                }
            })

            app.post("/addTodo", (req, res) => {
                const data=req.body;
                // console.log(data)
                try{
                    collection.insertOne(data)
                    .then(result=>res.send(result.acknowledged))
                    .catch(err=>console.log(err))
                }
                catch(err){
                    res.send("Something Went Wrong")
                    res.send(err)
                }
            })
            app.put("/editTodo/:id", (req, res) => {
                const id=req.params
                const data=req.body
                // console.log(id,data)
                try{
                    collection.updateOne(
                    { _id: ObjectId(id.id) },
                    { 
                        $set: {status:"completed"},
                        $currentDate: { lastModified: true }
                    })
                    .then(result=>res.send(result.modifiedCount>0))
                    .catch(err=>console.log(err))
                }
                catch(err){
                    console.log(err)
                    res.send(err)
                }
            })
            app.delete("/deleteTodo/:id", (req, res) => {
                try{
                    const id = req.params
                    // console.log(id)
                    collection.deleteOne(
                        {
                            _id: ObjectId(id.id)
                        }
                        )
                        .then(result => res.send(result.deletedCount>0))
                        .catch(err => console.log(err))
                }
                catch(err){
                    console.log(err)
                    res.send(err)
                }
            })
        }

        catch(err){
            console.log(err)
        }
    }
});






app.listen(5000,()=>console.log("Listening to port 5000..."))