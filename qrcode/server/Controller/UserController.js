require('dotenv').config()
const userModle = require('../Model/User')
const LinkQrModel = require('../Model/LinkQr')
const tokenBlackListModel = require('../Model/TokenBlackList')
const ResetPassModel = require('../Model/ResetPass')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer')
const crypto = require('crypto')

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
        
exports.testuser = async (req, res) => {
    res.json({"msg":"User Route is working"})
}

exports.addlinkqr = async(req,res)=>{
    const qrlink = req.body.qrlink
    const qrcolor = req.body.qrcolor
    const user = req.user.id

    try {
        const newLinkQR = new LinkQrModel({
            qrlink,
            qrcolor,
            user
        })

        const saveQR = await newLinkQR.save()
        res.json({saveQR})
    } catch (error) {
        res.json({"error":error})
    }
}

exports.getqrlinks = async(req,res)=>{
    try {
        const qrlinks = await LinkQrModel.find({user:req.user.id})
        res.json(qrlinks)
    } catch (error) {
        res.json({"error":error})
    }
}

exports.deleteqr = async(req,res)=>{
    const { qrid } = req.params
    
    try {
        const deleteQr = await LinkQrModel.findByIdAndDelete(qrid)
        if(deleteQr){
            res.json({"deletests":0, "msg":"QR has Deleted"})
        }else{
            res.json({"deletests":1, "msg":"QR has not Deleted"})
        }
    } catch (error) {
        res.json({"error":error})
    }
}

exports.editqr = async(req,res)=>{
    const {qrid} = req.params
    const qrlink = req.body.qrlink
    const qrcolor = req.body.qrcolor

    try {
        const updateQr = await LinkQrModel.findByIdAndUpdate(
            qrid,
            {qrlink, qrcolor},
            {new:true}
        )

        res.json(updateQr)
    } catch (error) {
     res.json({"error":error})   
    }
}

exports.reguser = async (req, res) => {
    const uname = req.body.uname
    const uemail = req.body.uemail
    const password = await bcrypt.hash(req.body.upass, 12) 
    try {
        const newUser = new userModle({
            "user_name":uname,
            "user_email":uemail,    
            "password":password
        })
        const saveUser = await newUser.save()
        res.json({saveUser}) 
    } catch (error) {
        res.json({"error":error})
    }
}

exports.loginuser = async(req, res)=>{
    const uemail = req.body.uemail
    const upass = req.body.upass
    try {
        const userLogin = await userModle.findOne({
            "user_email":uemail
        })
        console.log(userLogin)
        if(!userLogin){
            res.json({"loginsts":1, "msg":"User not found"})
        } else {
            const isMatch = await bcrypt.compare(upass, userLogin.password)
            if(!isMatch){
                res.json({"loginsts":2, "msg":"Password not match"})
            } else {
                const token = jwt.sign(
                    {id:userLogin._id, user_email:userLogin.user_email},
                    process.env.JWT_USER_SECRET,
                    {expiresIn:'1h'}
                )
                res.json({"loginsts":0, "msg":"Login Success", "token":token})
            }
        }  
    } catch (error) {
        res.json({"msg":error})
    }
}

exports.logoutuser = async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        res.json({"msg":"No token found"})
    }

    try {
        const tokenData = new tokenBlackListModel(
            {token}
        )
        const saveBlcToken = await tokenData.save()
        res.json(saveBlcToken)
    } catch (error) {
        res.json({"error":error})
    }
}

exports.forgetpass = async(req,res)=>{
    const user_email = req.body.email
    try {
        const user = await userModle.findOne({user_email})
        if(!user){
            return res.json({"sts":1, "msg":"User not found"})
        }

        const token = crypto.randomBytes(32).toString('hex')

        await ResetPassModel.deleteMany({userId:user._id})

        const newReset = new ResetPassModel({
            userId:user._id,
            reset_token:token,
        }) 

        await newReset.save()
        
        const resetLink = `${process.env.CLIENT_URL}/reset-pass/${token}`
        await transporter.sendMail({
            from: '"JotPhone Password Assistance" <no-reply@teamswork.com>',
            to:user.user_email,
            subject:"JotPhone Password Reset Request",
            html:`
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>We received a request to reset your JotPhone account password.</p>
                    <p>Please click the link below to reset your password:</p>
                    <p>
                        <a href="${resetLink}" 
                        style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                            Reset Password
                        </a>
                    </p>
                    <p style="font-size: 0.9em; color: #777;">
                        Or copy and paste this URL into your browser:<br>
                        <span style="word-break: break-all;">${resetLink}</span>
                    </p>
                    <p style="font-size: 0.9em;">
                        <strong>Note:</strong> This link will expire in 10 minutes.
                    </p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.9em; color: #777;">
                        Thank you,<br>
                        The JotPhone Team
                    </p>
                </div>    
            `
        })
        return res.json({"sts":0, "msg":"Password reset link has been sent to your email"})
    } catch (error) {
        res.json({"error":error})
    }
}

//http://127.0.0.1:5000/api/user/reset-pass/1234567890
exports.resetpass = async(req,res)=>{
    const { token } = req.params
    const user_pass = req.body.password

    try {
        const resetToken = await ResetPassModel.findOne({"reset_token":token})
        if(!resetToken){
            return res.json({"reststs":1, "msg":"Invalid or Expiered Link"})
        }

        const upass = await bcrypt.hash(user_pass, 12) 

        const resetPass = await userModle.findOneAndUpdate(
            {_id:resetToken.userId},
            {$set:{"password":upass}},
            {new:true},
        )

        await ResetPassModel.deleteMany({"reset_token":token})

        res.json({"reststs":0,"msg":"Your Password has been updated successfully"})
    } catch (error) {
        res.json({"error":error})
    }
}

