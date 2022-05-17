const mongoose = require("mongoose")
//#############################################################################################################
// Function to validate all the data that is coming from req.body ,req.query
const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
//#############################################################################################################
//Function to check that somethiing is coming from request body or not by checking the length of array which contain keys of req.body,req,query
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length != 0
}
//#############################################################################################################
//Function to validate all the Ids that is coming from req.body,req.params,req.query
const isValidObjectId = function (Id) {
    return mongoose.isValidObjectId(Id)          //mongoose.Types.ObjectId.isValid(Id)
}
//#############################################################################################################
//Function to validate the format and check the date is correct or not
const isValidDate = function (s) {
    // Assumes s is "YYYY/MM/DD"
    if ( ! /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/.test(s) ) {
        return false;
    }
    const dateParts = s.split('-').map((p) => parseInt(p, 10));
    dateParts[1] -= 1;
    const d = new Date(dateParts[0], dateParts[1], dateParts[2]);
    return d.getMonth() === dateParts[1] && d.getDate() === dateParts[2] && d.getFullYear() === dateParts[0];
}
//#############################################################################################################
//Function to check the title which is enum here
const isValidTitle = function (value) {
    return ["Mr", "Mrs", "Miss"].indexOf(value.trim()) >= 0
}
//#############################################################################################################
module.exports={isValid,isValidRequestBody,isValidObjectId,isValidDate,isValidTitle}