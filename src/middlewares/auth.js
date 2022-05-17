const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")

const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) return res.status(403).send({ status: false, message: "Authentication Failed" })
        const decodedToken = await jwt.verify(token, "Project3/BookManagement(@#@42)")
        if (!decodedToken) return res.status(400).send({ status: false, msg: "Token is invalid" });
        req["decodedUserId"] = decodedToken.userId
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        const userId = req.body.userId
        const bookId = req.params.bookId
        const decodedUserId = req.decodedUserId

        if (bookId) {
            if(! isValidObjectId(bookId)) return res.status(400).send({status:false,message:"Invalid Book ID A1"})
            const bookDetails = await bookModel.findOne({ _id: bookId })
            if (!bookDetails) return res.status(404).send({ status: false, message: "Book not Found A1" })
            const incomingUserId = bookDetails.userId
            if (incomingUserId.toString() !== decodedUserId) return res.status(403).send({ status: false, message: "You Are Not Authorized" })        
        }
        if (userId) {
            if(! isValidObjectId(userId)) return res.status(400).send({status:false,message:"Invalid User ID A1"})
            if(! await userModel.findOne({_id:userId})) return res.status(404).send({status:false,message:"User Not Found A1"})
            if (userId !== decodedUserId) return res.status(403).send({ status: false, message: "You Are Not Authorized" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { authentication, authorization }