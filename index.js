const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const mongoClient = mongodb.MongoClient
const objectId = mongodb.ObjectID

const url = process.env.DB_URL;


const app = express();
let port = process.env.PORT ||  3000;
app.listen(port, ()=> console.log("App is listening on port ",port));
app.use(express.json());
app.use(cors())


app.post("/add-mentor", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url,{ useUnifiedTopology: true })
        let db = client.db("Organisation")
        let result = await db.collection("mentors").insertOne(req.body)
        res.status(200).json({
            message :"Mentor record inserted"
        })
        client.close()
    }
    catch(error){
        res.status(500).json({
            message: "Error while adding the mentor"
        })
    }
})


app.post("/add-student", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("students").insertOne(req.body)
        res.status(200).json({
            message :"Student record inserted"
        })
        client.close()
    }
    catch(error){
        res.status(500).json({
            message: "Error while adding the student"
        })
    }
})


app.put("/assign-mentor/:id", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("students").findOneAndUpdate({_id: objectId(req.params.id)}, {$set :req.body})
        res.status(200).json({
            message : "Mentor assigned"
        })
        client.close()
    }
    catch(error){
        res.status(500).json({
            message: "Error while assigning the mentor"
        })
    }
})

app.put("/change-mentor/:id", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("students").findOneAndUpdate({_id: objectId(req.params.id)}, {$set :req.body})
        res.status(200).json({
            message : "Mentor changed"
        })
        client.close()
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: "Error while changing the mentor"
        })
    }
})


app.get("/get_students/:name", async(req, res)=>{
    try{
    let client = await mongoClient.connect(url)
    let db = client.db("Organisation")
    let result = await db.collection("students").find({mentor_name: name}).toArray()
    res.status(200).json({
        data : result,
        message : "Records fetched successfully"
    })
    client.close()
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching students"
        })
    }

})

app.get("/get_mentors", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("mentors").find().toArray()
        res.status(200).json({
            data : result,
            message : "Records fetched successfully"
        })
        client.close()
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching mentors"
        })
    }

})


app.get("/get_assigned_students", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("students").find({mentor_name:{$exists:true}}).toArray()
        res.status(200).json({
            data : result,
            message : "Recodrs fetched successfully"
        })
        client.close()
        }
        catch(error){
            res.status(500).json({
                message:"Error while fetching students"
            })
        } 
})

app.get("/get_not_assigned_students", async(req, res)=>{
    try{
        let client = await mongoClient.connect(url)
        let db = client.db("Organisation")
        let result = await db.collection("students").find({mentor_name:{$exists:false}}).toArray()
        res.status(200).json({
            data : result,
            message : "Recodrs fetched successfully"
        })
        client.close()
        }
        catch(error){
            res.status(500).json({
                message:"Error while fetching students"
            })
        } 
})

