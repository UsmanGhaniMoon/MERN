require('dotenv').config()
const jwt = require('jsonwebtoken')
const TokenBlackList = require('../Model/TokenBlackList')


const UserAuthentication = async (req, res, next) => {
    const header = req.headers['authorization']
    if (!header || !header.startsWith('Bearer')) {
        res.json({"tokensts":1,"msg":"No token found or invalid token"})
    } else {
        const token = header.split(' ')[1]

        const isBlackList = await TokenBlackList.findOne({token})
        if(isBlackList){
            res.json({"tokensts":3,"msg":"Token is not valid"}) 
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_USER_SECRET)
            req.user = verified
            next()
        } catch (error) {
            res.json({"tokensts":2,"msg":error})
        }
    }
}

module.exports = UserAuthentication 