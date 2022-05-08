const mongoose =require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require("moment")

const bookSchema = new mongoose.Schema({
    title: {type:String, required:true, unique:true},
    excerpt: {type:String, required:true}, 
    userId: {ObjectId, required:true, ref:"User"},
    ISBN: {type:String, required:true, unique:true},
    category: {type:String, required:true},
    subcategory:{type: [String],required:true },
    reviews: {type:Number, default: 0}, //comment: Holds number of reviews of this book
    deletedAt: {Date}, //, when the document is deleted
    isDeleted: {boolean, default: false},
    releasedAt: {Date, required:true, default: () => moment().format('YYYY-MM-DD')},

},{timestamps:true})

module.exports = mongoose.model("Book",bookSchema)