const Admin = require('../../models/Admin')
const AdminToken = require('../../models/AdminToken')
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const AdminPassReset = require('../../models/AdminPassReset')
const { sendEmail } = require('../../CommonSnips/emailSender')

//const SECRET_KEY = "Usman"

const router = express.Router()

//http://127.0.0.1:5000/api/admin/createadmin
router.post('/createadmin',async(req, res)=>{
    try{
        const newAdmin = new Admin({
            admin_name:req.body.admin_name,
            admin_email:req.body.admin_email,
            admin_pass: await bcrypt.hash(req.body.admin_pass, 12)
        })

        const saveAdmin = await newAdmin.save()
        res.status(200).json({saveAdmin})
    } catch(error){
        console.error(error)
        res.status(500).json({'error':error})
    }
})

//http://127.0.0.1:5000/api/admin/login
router.post('/login', async(req, res)=>{
    const admin_email = req.body.admin_email
    const admin_pass = req.body.admin_pass
    try{
        const login = await Admin.findOne({admin_email})
        if(!login){
            return res.json({'status':1, "message":"Email id is not Found"})
        }else{
            if(await bcrypt.compare(admin_pass, login.admin_pass)){
                const token = jwt.sign({adminId:login._id}, process.env.ADMIN_TOKEN_SECRET, {expiresIn:'6hr'})
                const expiresAt = new Date(Date.now()+(6*60*60*1000))
                const adminTokenSave = new AdminToken({
                    adminId:login._id,
                    token,
                    expiresAt
                })
                const aid = login._id
                const aemail = login.admin_email
                const aname = login.admin_name

                await adminTokenSave.save()
                return res.json({'status':0, aid, aemail, aname, token})
            }else{
                return res.json({'status':2, "message":"Password is wrong"})
            }
        }
    } catch(error){
        res.status(500).json({'error':error})
    }
})

//http://127.0.0.1:5000/api/admin/checktoken
router.post('/checktoken', async(req,res)=>{
    const token = req.body.token
    try{
        const tokenchk = await AdminToken.findOne({token})
        if(!tokenchk){
            return res.json({'tokensts':1})
        }else{
            return res.json({'tokensts':0})
        }
    } catch(error){
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/updatepass
router.post('/updatepass', async(req, res)=>{
    const admin_email = req.body.admin_email
    const old_pass = req.body.old_pass
    const admin_pass = req.body.admin_pass

    try{
        const passchk = await Admin.findOne({admin_email})
        if(await bcrypt.compare(old_pass, passchk.admin_pass)){

            const hasadmin_pass = await bcrypt.hash(admin_pass, 12) 
            const updateAdminPass = await Admin.findOneAndUpdate(
                {admin_email:admin_email},
                {$set:{admin_pass:hasadmin_pass}},
                {new:true}
            )
            return res.json({"chpasssts":0, "msg":"Password is Changed"})
        } else{
            return res.json({"chpasssts":1, "msg":"Password not changed as old pass do not match"})
        }
    } catch(error){
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/logout
router.post('/logout', async(req, res)=>{
    const token = req.body.token

    try{
        const logout = await AdminToken.findOneAndDelete({token})
        if(!logout){
            return res.json({'logoutsts':1,"msg":"Logout Failed"})
        } else {
            return res.json({'logoutsts':0,"msg":"Logout Success"})
        }
    } catch(error){
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/sendresetlink
router.post('/sendresetlink', async(req, res)=>{
    const admin_email = req.body.admin_email
    try{
        const findadmin = await Admin.findOne({admin_email})
        if(!findadmin){
            return res.json({"sts":1,"msg":"Email Not Found"})
        } else {
            const subject = "E-shop : Reset Password link"
            const reset_token = shortid.generate()
            const expiresAt = new Date(Date.now()+(60*60*1000))
            const text = `Your Reset password link is : http://localhost:3000/adminpassreset/${reset_token}`

            const saveResetToken = new AdminPassReset({
                admin_email,
                reset_token,
                expiresAt,
            })

            const result = await saveResetToken.save()
            
            sendEmail(admin_email, subject, text)

            return res.json({"sts":0, "msg":"Your reset link has sent","reset_url":`http://localhost:3000/adminpassreset/${reset_token}`})
        }
    } catch(error){
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/resetpass
router.post('/resetpass', async(req, res)=>{
    const reset_token = req.body.reset_token
    const admin_pass = await bcrypt.hash(req.body.admin_pass, 12)

    try {
        const findadmin = await AdminPassReset.findOne({reset_token})
        if (!findadmin) {
            return res.json({"sts":1,"msg":"Your link is expired"})
        } else {
            const admin_email = findadmin.admin_email
            const updateAdminPass = await Admin.findOneAndUpdate(
                {admin_email:admin_email},
                {$set:{admin_pass:admin_pass}}, 
                {new:true}
            )

            const deltoken = await AdminPassReset.findOneAndDelete({reset_token})
            return res.json({"sts":0,"msg":"Your password is updated"})
        }
    } catch(error){
        console.error(error)
    }
})


module.exports = router