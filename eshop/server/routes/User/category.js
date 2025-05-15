require('dotenv').config()
const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')

//http://127.0.0.1:5000/api/user/category/getcategory
router.get('/getcategory',async(req,res)=>{
    try {
        const cat = await Category.find()
        if (!cat) {
            return res.json({"catsts":1, "msg":"No Category Found"})
        } else {
            return res.json({"catsts":0, "msg":"Category Found", "categories":cat})
        }
    } catch (error) {
        console.error(error)
    }
})



module.exports = router