const express = require("express");
const bodyParser = require("body-Parser");
const mongoose =require("mongoose")
const route = require("./routes/route");

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Functionup_user1:xjCaggwJRDuZ6bjP@my-first-cluster.sfq4n.mongodb.net/Project3",{useNewUrlParser:true})
.then( () => console.log("mongoDb is Connected"))
.catch( err => console.log(err.message))

app.use("/",route);

app.listen(process.env.PORT||3000 , function (){
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});