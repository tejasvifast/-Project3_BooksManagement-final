const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const createUser = async (req, res) => {
    try {
        const data = req.body
        const createdUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Registered Successfully..", data: createdUser })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

const loginUser = async(req,res)=>{
    try {
        const email = req.body.email
        const password =req.body.password
        const loginUser = await userModel.findOne({email,password})
        if(!loginUser) return res.status(400).send({status:false,message:"Wrong Credentials.."})
        const token = await jwt.sign({userId:loginUser._id },{expiresIn: "120s"},"Project3/BookManagement")
        return res.status(201).send({ status: true, message: "Token Generated Successfully..", data: token })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }

}


module.exports = {createUser,loginUser}