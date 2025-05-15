require('dotenv').config()
const jwt = require('jsonwebtoken')

const UserAuthentication = (req, res, next) => {
    const header = req.headers['authorization']

    if (!header || !header.startsWith('Bearer ')) {
        res.json({"utoken_sts":1, "msg":"User Token not found or Invalid"})
    } else {
        const token = header.split(' ')[1]
        try {
            const verified = jwt.verify(token, process.env.USER_TOKEN_SECRET)
            req.user = verified
            console.log(req.user)
            next()
        } catch (error) {
            res.json({"utoken_sts":2, "msg":"User Token not found or Invalid"})
        }
    }
}


module.exports = UserAuthentication