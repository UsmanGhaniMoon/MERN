require('dotenv').config()
const express = require('express')
const router = express.Router()

const Category = require('../../models/Category')
const Product = require('../../models/Product')


//http://127.0.0.1:5000/api/user/product/getallproduct
router.get('/getallproduct',async(req,res)=>{
    try {
        const products = await Product.find({"product_status":"Enable"}).populate('pro_cat')
        if (!products) {
            return res.json({"productssts":1, "msg":"No Product Found"})
        } else {
            return res.json({"productssts":0, "msg":"Product Found", "products":products})
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router