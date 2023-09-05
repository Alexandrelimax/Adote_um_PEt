const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async () => {

    await mongoose.connect(process.env.URI)
    console.log("connected database");
}

module.exports = { connectDb, mongoose };