require('dotenv').config()
const express = require('express')
const shortid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const Admin = require('../../models/Admin')
const AdminToken = require('../../models/AdminToken')
const Category = require('../../models/Category')

const catDir = path.join(path.resolve(__dirname,'../..'),'categories')

//Storager engine setup
const catStore = multer.diskStorage({
    destination:'./categories',
    filename:function(req,file,cb){
        const iname = shortid.generate()
        cb(null, iname+path.extname(file.originalname))
    }
})

//Intialize multer
const uploadCat = multer({
    storage:catStore,
    limits:{fileSize:1024000}
})

//http://127.0.0.1:5000/api/admin/category/addcategory
router.post('/addcategory',uploadCat.single('cat_img'), async(req,res)=>{
    const cat_name = req.body.cat_name
    const cat_img = req.file.filename
    const newCat = new Category({
        cat_name,
        cat_img
    })
    newCat.save()
    res.json({"sts":0, "msg":"Category Uploaded"})
})

//http://127.0.0.1:5000/api/admin/category/getcat
router.get('/getcat', async(req,res)=>{
    try {
        const cat = await Category.find()
        if (!cat) {
            return res.json({"viewcatsts":1,"msg":"no category found"})
        } else {
            return res.json({"viewcatsts":0,cat})
        }
    } catch (error) {
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/category/deletecat
router.delete('/deletecat/:id', async(req,res)=>{
    
    const catId = req.params.id
    const scat = await Category.findById(catId)
    const cImage = scat.cat_img

    const filepath = path.join(catDir,cImage)
    try {
       
        const cat = await Category.findByIdAndDelete(catId)
        if (!cat) {
            return res.json({"delsts":1,"msg":"Category not deleted"})
        } else {
            fs.unlinkSync(filepath)
            return res.json({"delsts":0,"msg":"Category deleted"})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ "delsts": 1, "msg": "Server error" });
    }
})

module.exports = router