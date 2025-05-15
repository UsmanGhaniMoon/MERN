require('dotenv').config()

const express = require('express')

const cors = require('cors')

const db = require('./db')

//const uauth = require('./middleware/UserAuthentication')

//All Routes
//Admin Routes
const adminLoginRoute = require('./routes/Admin/adminlogin')
const adminCategoryRoute = require('./routes/Admin/category')
const adminProductRoute = require('./routes/Admin/product')

//User Routes
const userRoute = require('./routes/User/user')
const userCatRoute = require('./routes/User/category')
const userProRoute = require('./routes/User/product')

const app = express()

app.use(express.json())

app.use(cors())

//All Static Folder access
app.use('/cats',express.static('categories'))
app.use('/pros',express.static('products'))

//All Routes api
app.use('/api/admin', adminLoginRoute)
app.use('/api/admin/category', adminCategoryRoute)
app.use('/api/admin/product', adminProductRoute)
app.use('/api/user/category', userCatRoute)
app.use('/api/user/product', userProRoute)
app.use('/api/user', userRoute)
 
const port = process.env.PORT

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.listen(port,()=>{
    console.log(`Server is running on : http://127.0.0.1:${port}`)
})

