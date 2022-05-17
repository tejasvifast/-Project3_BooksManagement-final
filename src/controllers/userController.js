const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
//#######################################################################################################################################################################
//Here We Requiring All the validation function from util/validations
const { isValid, isValidRequestBody, isValidTitle } = require("../utils/validations")
//#######################################################################################################################################################################

const userCreate = async function (req, res) {
    try {
        const requestBody = req.body
        const { title, name, phone, email, password, address } = requestBody

        let nameRegex = /^[a-zA-Z ]{2,30}$/
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide user details" })

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: `${title} --> Title Should be among Mr,Mrs,Miss ` })

        if (!name) return res.status(400).send({ status: false, message: "Name is Required ..." })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name Should be valid ..." })
        if (!name.match(nameRegex)) return res.status(400).send({ status: false, message: "Name Should not contain Number and length between 2-30 " })

        if (!phone) return res.status(400).send({ status: false, message: "Phone Number is Required ..." })
        if (!phone.trim().match(phoneRegex)) return res.status(400).send({ status: false, message: `${phone} Please enter valid Phone....` })
        if (await userModel.findOne({ phone: phone })) return res.status(400).send({ status: false, message: ` Please enter Unique Phone number....` })

        if (!email) return res.status(400).send({ status: false, message: "Email Id is Required ...." })
        if (!email.trim().match(emailRegex)) return res.status(400).send({ status: false, message: `${email} Please enter valid Email Id...` })
        if (await userModel.findOne({ email: email })) return res.status(400).send({ status: false, message: `Please enter unique Email Id....` })

        if (!password) return res.status(400).send({ status: false, message: " Password is Required ...." })
        if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, message: " Password Length Should be Between 8 and 15 ..." })

        if (address) {
            const { street, city, pincode } = address
            if (street)
                if (!isValid(street)) return res.status(400).send({ status: false, message: "Street Should be valid ... " })
            if (city)
                if (!isValid(city)) return res.status(400).send({ status: false, message: "City Should be valid ... " })
            if (!city.match(nameRegex)) return res.status(400).send({ status: false, message: "City Name Should not contain Number" })
            if (pincode) {
                if (!isValid(pincode)) return res.status(400).send({ status: false, message: "Pincode Should be valid ... " })
                if (!pincode.trim().match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/)) return res.status(400).send({ status: false, Message: `${pincode} --> Pincode Should be Valid Indian pincode...` })
            }
        }

        const emailAlready = await userModel.findOne({ email: email })
        if (emailAlready) return res.status(400).send({ status: false, message: "Email Already Exist" })

        const userCreated = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User Created Successfully ", data: userCreated })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}
//#######################################################################################################################################################################
const userLogin = async function (req, res) {
    try {
        const requestBody = req.body
        const { email, password } = requestBody
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide login details" })

        const userLogin = await userModel.findOne({ email: email, password: password })
        if (!userLogin) return res.status(400).send({ status: false, message: "Invalid Login Credentials" })

        const token = await jwt.sign({ userId: userLogin._id }, "Project3/BookManagement(@#@42)", { expiresIn: "10s" })
        console.log(token)
        return res.status(200).send({ status: true, message: "Login Successfully", data: token })
    }
    catch (err) {
        res.status(500).send({ status: false, messsage: err.messsage })
    }
}
//#######################################################################################################################################################################
module.exports = { userCreate, userLogin }
