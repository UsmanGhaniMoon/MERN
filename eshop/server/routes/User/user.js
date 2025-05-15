require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../../models/User')

const uauth = require('../../middleware/UserAuthentication')

//http://127.0.0.1:5000/api/user/userreg
router.post('/userreg',async(req,res)=>{
    const uemail = req.body.uemail
    const upass = await bcrypt.hash(req.body.upass,12) 
    try {
        const newUser = new User({
            uemail,
            upass
        })    
        const saveUser = await newUser.save()
        return res.json({"usersts":0, "msg":"User Registered", saveUser})      
    } catch (error) {
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/user/userlogin
router.post('/userlogin',async(req,res)=>{
    const uemail = req.body.uemail
    const upass = req.body.upass
    try {
        const userLogin = await User.findOne({uemail})
        if (!userLogin) {
            return res.json({"loginsts":1, "msg":"User Email not found"})
        } else {
            const isMatch = await bcrypt.compare(upass, userLogin.upass)
            if (!isMatch) {
                return res.json({"loginsts":2, "msg":"Password does not match"})
            } else {
               const token = jwt.sign({id:userLogin._id}, process.env.USER_TOKEN_SECRET, {expiresIn:'1h'})
                return res.json({"loginsts":0, "msg":"User Logged In", token}) 
            }
        }
    } catch (error) {
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/user/testauth
router.get('/testauth',uauth,async(req,res)=>{
    res.json({"msg":"This route called Successfully"})
})

module.exports = router