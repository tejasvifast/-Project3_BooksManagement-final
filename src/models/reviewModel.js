const mongoose= require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {ObjectId, required:true, ref:"Book"},
    reviewedBy: {type:String , required:true, default :'Guest' } , //, value: reviewers name
    reviewedAt: {Date, required:true},
    rating: {type:Number, range:[1,5], required:true},
    review: {type:String },
    isDeleted: {type:Boolean, default: false},

},{timestamps:true})

module.exports = mongoose.model("Review",reviewSchema)