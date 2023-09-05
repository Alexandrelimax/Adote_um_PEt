const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()


const getUserByToken = async (token) => {

    const decoded = jwt.verify(token, process.env.SECRET)

    const user = await User.findById({ _id: decoded.id })

    return user;

}


module.exports = getUserByToken;