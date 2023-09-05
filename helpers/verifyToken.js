const jwt = require('jsonwebtoken')
const getToken = require('./getToken');
require('dotenv').config()


const verifyToken = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json('Acesso negado');
    }

    const token = getToken(req.headers.authorization)

    try {
        const isvalidToken = jwt.verify(token, process.env.SECRET)
        req.user = isvalidToken
        next();
    } catch (error) {
        return res.status(400).json('Token Inválido! ')
    }

















}







module.exports = verifyToken;