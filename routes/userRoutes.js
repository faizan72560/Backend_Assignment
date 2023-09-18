const express= require("express")
const {registeruser,loginuser,logout, getuser,updateUser,deleteUser,resetSendEmail, verifyOTP, changePassword}=require("../controller/userController")

const router=express.Router()

router.route('/register').post(registeruser)
router.route('/login').post(loginuser)
router.route('/me').get(getuser)
router.route('/logout').get(logout)
router.route('/user/:id').put(updateUser)
router.route('/user/:id').delete(deleteUser)
router.route('/forgot-password').post(resetSendEmail)
router.route('/verify-otp').post(verifyOTP)
router.route('/change-password').post(changePassword)






module.exports=router