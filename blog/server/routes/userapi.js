const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()

const User = require('../models/user')
const Token = require('../models/token')

const SECRET_KEY = "usman"

const storage = multer.diskStorage({
    destination:'./uploads/',
    filename:function(req, file, cb){
        cb(null,file.fieldname+"-"+Date.now()+".png")
    }
})

const upload = multer({
    storage:storage,
    limits:{fileSize:1000000}
})

router.post('/uploadimage', upload.single('profile_pic'), (req, res)=>{
    res.json({'message':'File uploaded successfully'})
})

//add user
router.post('/adduser', async(req, res)=>{
    try{
        const newUser = new User({
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            user_dob: req.body.user_dob,
            gender: req.body.gender,
            //password: bcrypt.hashSync(req.body.user_dob, 12),
            password: await bcrypt.hash(req.body.password, 12)
        })
    
        const saveUser = await newUser.save()
        res.json(saveUser)
    } catch(error) {
        console.error(error)
        res.status(500).json({'error':error})
    }
    
})

//User login
router.post('/userlogin', async(req, res)=>{
    const email = req.body.user_email
    const password = req.body.password

    try{
        const login = await User.findOne({user_email:email})
        if(!login){
            return res.json({'status':1,'message':'Email not found!'})
        }else{
            if(await bcrypt.compare(password,login.password)){
                const token = jwt.sign({userid:login._id}, SECRET_KEY,{expiresIn:'1hr'})
                const expiresAt = new Date(Date.now()+60*60*1000)
                const tokenSave = new Token({
                    userId:login._id,
                    token,
                    expiresAt,
                })
                const user_name = login.user_name
                await tokenSave.save()

                return res.json({'status':0,'message':'Login success','user_name':user_name,token})
            }else{
                return res.json({'status':2,'message':'password is wrong'})
            }
        }
    } catch(error) {
        res.json(error)
    }
})

//check login
router.post('/checktoken', async(req, res)=>{
    const token = req.body.token
    try{
        const tokenchk = await Token.findOne({token})
        if(!tokenchk){
            return res.json({'tokenstatus':1})
        }else{
            return res.json({'tokenstatus':0})
        }
    } catch(error){
        console.error(error)
    }
})

//logout
router.post('/logout', async(req, res)=>{
    const token = req.body.token
    try{
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const logout = await Token.findOneAndDelete({ token });
        if (logout) {
            return res.json({ logout_status: 0, message: "Logout successful" });
        } else {
            return res.status(404).json({ logout_status: 1, message: "Token not found", token:token });
        }
    } catch(error){
        console.error(error);
        res.status(500).json({ logout_status: 1, message: "Server error" });
    }
})

//get all users
router.get('/viewuser', async(req,res)=>{
    try{
        const users = await User.find()
        res.json(users)
    } catch(error){
        res.status(500).json({'Error':error})
    }
})

//get single user
router.get('/singleuser/:userid', async(req, res)=>{
    const uid = req.params.userid
    try{
        const users = await User.findById(uid)
        res.json(users)
    } catch(error){
        res.status(500).json({'Error':error})
    }
})

//Update user
router.put('/updateuser/:userid', async(req, res)=>{
    const uid = req.params.userid
    try{

        let updateData = { ...req.body }
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 12)
        }

        const updatedUser = await User.findByIdAndUpdate(
            uid,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(updatedUser)

    } catch(error){
        res.status(500).json({'Error':error})
    }
})

//Delete user
router.delete('/deleteuser/:userid', async(req, res)=>{
    const uid = req.params.userid
    try{
        const users = await User.findByIdAndDelete(uid)
        res.status(200).json({'message':'User has been deleted successfully!', 'status':'1'})
    } catch(error){
        res.status(500).json({'Error':error})
    }
})

module.exports = router