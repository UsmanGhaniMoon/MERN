const express = require('express')
const router = express.Router()

const userController = require('../Controller/UserController')
const uAuth = require('../Middleware/UserAuthentication')

//http://127.0.0.1:5000/api/user/testuer
router.get('/testuer',uAuth,userController.testuser)

//http://127.0.0.1:5000/api/user/addlinkqr
router.post('/addlinkqr',uAuth,userController.addlinkqr)

//http://127.0.0.1:5000/api/user/getqrlinks
router.get('/getqrlinks',uAuth,userController.getqrlinks)

//http://127.0.0.1:5000/api/user/deleteqr/qrid
router.delete('/deleteqr/:qrid',uAuth,userController.deleteqr)

//http://127.0.0.1:5000/api/user/editqr/qrid
router.post('/editqr/:qrid',uAuth,userController.editqr)

//http://127.0.0.1:5000/api/user/logoutuser
router.get('/logoutuser',uAuth,userController.logoutuser)

//http://127.0.0.1:5000/api/user/reguser
router.post('/reguser',userController.reguser)

//http://127.0.0.1:5000/api/user/loginuser
router.post('/loginuser',userController.loginuser)

//http://127.0.0.1:5000/api/user/forgetpass
router.post('/forgetpass',userController.forgetpass)

//http://127.0.0.1:5000/api/user/reset-pass/token
router.post('/reset-pass/:token',userController.resetpass)


module.exports = router