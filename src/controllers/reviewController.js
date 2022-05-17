const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")
//#######################################################################################################################################################################
//Here We Requiring All the validation function from util/validations
const { isValid, isValidRequestBody, isValidObjectId } = require("../utils/validations")
//#######################################################################################################################################################################

const createReview = async function (req, res) {
    try {
        const requestBodyReview = req.body
        const bookIdByParams = req.params.bookId
        const { reviewedBy, rating, review } = requestBodyReview

        if (!isValidObjectId(bookIdByParams)) return res.status(400).send({ status: false, message: "BookId is not valid ObjectId" })
        if (!(await bookModel.findOne({ _id: bookIdByParams, isDeleted: false }))) return res.status(400).send({ status: false, message: "Book is not created yet ,or Maybe Deleted" })
        requestBodyReview.bookId = bookIdByParams

        if (!isValidRequestBody(requestBodyReview)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide something to make review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewby field Should be Valid..." })

        if (review)
            if (!isValid(review)) return res.status(400).send({ status: false, message: "review field Should be Valid..." })

        if (!rating) return res.status(400).send({ status: false, message: "rating field is Required ..." })
        if (!/\d/.test(rating)) return res.status(400).send({ status: false, message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, message: "rating range should be 1-5 ..." })

        requestBodyReview.reviewedAt = new Date()
        const createdReview = await reviewModel.create(requestBodyReview)
        const bookDetail = await bookModel.findOneAndUpdate({ _id: bookIdByParams }, { $inc: { reviews: 1 } }, { new: true }).lean()
        const allReviews = await reviewModel.find({ bookId: createdReview.bookId }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, _v: 0 })
        bookDetail.reviewedData = allReviews
        return res.status(201).send({ status: true, message: "created successfully", data: bookDetail })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}
//########################################################################################################################################################################

const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const requestedBody = req.body
        const { reviewedBy, review, rating } = requestedBody

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Enter a Valid BookId" })
        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookExist) return res.status(404).send({ status: false, message: "Book Not Found or Maybe Deleted" })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Enter a Valid reviewId" })
        const reviewExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExist) return res.status(404).send({ status: false, message: "Review Not Found or Maybe Deleted" })


        const bookReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!bookReview) return res.status(400).send({ status: false, message: "This review is not belong to this book,So You cant Update" })

        if (!isValidRequestBody(requestedBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide something to Update review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy is not valid ..." })

        if (review)
            if (!isValid(review)) return res.status(400).send({ status: false, message: "review is not valid ..." })

        if (rating)
            if (!/\d/.test(rating)) return res.status(400).send({ status: false, message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, message: "rating range should be 1-5 ..." })

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true })
        res.status(200).send({ status: true, message: "review update successfully", data: updatedReview })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}
//########################################################################################################################################################################

const deleteReview = async function (req, res) {
    try {
        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Enter a Valid BookId" })
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "This book is already deleted or Not Found" })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Enter a Valid reviewId" })
        const review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review) return res.status(404).send({ status: false, message: "this review is already deleted or Not Found" })

        //--------------------------------------------------Deleted here--------------------------------------------------//

        const bookReview = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!bookReview) return res.status(400).send({ status: false, message: "This review is not belong to this book" })

        const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { $set: { isDeleted: true, DeletedAt: Date.now() } }, { new: true });
        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        res.status(200).send({ status: true, message: "Review Deleted Successfully", data: deletedReview });
    }
    catch (err) {
        res.status(500).send({ message: "error", error: err.message })
    }
}
//########################################################################################################################################################################

module.exports = { createReview, updateReview, deleteReview }