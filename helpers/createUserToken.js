const jwt = require('jsonwebtoken')
require('dotenv').config()
const createToken = (user,req,res)=>{
    const token = jwt.sign({
        name:user.name,
        id:user._id
        
    },process.env.SECRET)

    res.status(200).json({
        message: 'Você está autenticado',
        token,
        UserId: user._id
    })
}

module.exports = createToken;

