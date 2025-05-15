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
const Product = require('../../models/Product')
const ProductImage = require('../../models/ProductImage')

const proDir = path.join(path.resolve(__dirname,'../..'),'products')

//Storager engine setup
const proStore = multer.diskStorage({
    destination:'./products',
    filename:function(req,file,cb){
        const iname = shortid.generate()
        cb(null, iname+path.extname(file.originalname))
    }
})

//Intialize multer
const uploadPro = multer({
    storage:proStore,
    limits:{fileSize:Infinity}
})

//http://127.0.0.1:5000/api/admin/product/addproduct
router.post('/addproduct',uploadPro.single('product_thumb'),async(req,res)=>{
    const pro_cat = req.body.pro_cat
    const product_name = req.body.product_name
    const product_shot_desc = req.body.product_shot_desc
    const product_long_desc = req.body.product_long_desc
    const product_thumb = req.file.filename
    const product_org_price = req.body.product_org_price
    const product_sale_price = req.body.product_sale_price
    const product_sale_start_date = req.body.product_sale_start_date
    const product_sale_end_date = req.body.product_sale_end_date
    const newPro = new Product({
        pro_cat,
        product_name,
        product_shot_desc,
        product_long_desc,
        product_thumb,
        product_org_price,
        product_sale_price,
        product_sale_start_date,
        product_sale_end_date
    })
    newPro.save()

    res.json({"sts":0, "msg":"Product Uploaded"})
})

//http://127.0.0.1:5000/api/admin/product/viewproduct
router.get('/viewproduct', async(req,res)=>{
    try {
        const products = await Product.find().populate('pro_cat')
        if (!products || products.length === 0) {
            return res.json({"viewprosts":1,"msg":"no product found"})
        } else {
            const formatedProducts = products.map(product=>{
                return {
                    _id: product._id,
                    product_name: product.product_name,
                    product_shot_desc: product.product_shot_desc,
                    product_long_desc: product.product_long_desc,
                    product_thumb: product.product_thumb,
                    product_org_price: product.product_org_price,
                    product_sale_price: product.product_sale_price,
                    product_sale_start_date: product.product_sale_start_date,
                    product_sale_end_date: product.product_sale_end_date,
                    product_status: product.product_status, 
                    category: product.pro_cat ? product.pro_cat.cat_name : "Unknown"
                }
            })
            return res.json({"viewprosts":0, product: formatedProducts})
        }
    } catch (error) {
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/product/changestatus
router.post('/changestatus', async(req,res)=>{
    const { productIds, newStatus } = req.body
    try {
        const updateResult = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { product_status: newStatus } }
        )
        return res.json({"msg":"Product Status Updated"})
    } catch (error) {
        console.error(error)
    }
})

//http://127.0.0.1:5000/api/admin/product/deleteproduct
router.post('/deleteproduct', async (req, res) => {
    const { productIds } = req.body;
    try {
        const result = await Product.deleteMany({ _id: { $in: productIds } });
        return res.json({ "msg": `Total ${result.deletedCount} Product(s) Deleted` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

//http://127.0.0.1:5000/api/admin/product/deletepro
router.delete('/deletepro/:id', async(req,res)=>{

    const spro = await Product.findById(req.params.id)
    const product_thumb = spro.product_thumb

    const filePath = path.join(proDir,product_thumb)

    try {
        const pro = await Product.findByIdAndDelete(req.params.id)
        if (!pro) {
            return res.json({"delsts":1,"msg":"Product Not Found"})
        } else {
            fs.unlinkSync(filePath)
            return res.json({"delsts":0,"msg":"Product Deleted"})
        }
    } catch (error) {
        return res.status(500).json({error:"Something went wrong"})
    }
})

const uploadImages = multer({
    storage:proStore
})

//http://127.0.0.1:5000/api/admin/product/uploadimage/:id
router.post('/uploadimage/:id',uploadImages.array('images'),async(req,res)=>{
    const productId = req.params.id
    const imageFiles = req.files
    
    try {
        const imagePromises = imageFiles.map(file=>{
            const newProdImage = new ProductImage({
                product_image:file.filename,
                proId:productId
            })
            return newProdImage.save()
        })
        
        await Promise.all(imagePromises)
        return res.json({"sts":0,"msg":"Product Images Uploaded"})
    } catch (error) {
        return res.json({"sts":1,"msg":"Some errors on server"})
    }
})

module.exports = router