
const User=require('../model/userModel')
const ErrorHandler = require('../utils/errorhandler')
const sendToken = require('../utils/jwtToken')
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require("dotenv").config({ path: "../config.env" });
const nodeEmail=process.env.nodeEmail
const emailPass=process.env.Password




exports.registeruser=(async(req,res)=>{
    try{
      console.log(req.body)
        const {name,email,password}=req.body
        console.log(req.body.email)    
    const user=await User.create({
        name,
        email,
        password,  
    })
    sendToken(user,200,res)
}catch(err){

  console.log(err)


    res.json({
        message:err.message
    })
}
    
})



exports.loginuser=(async(req,res,next)=>{
    try{ 
        const { email, password } = req.body;
        console.log(email)

      
        if (!email || !password) {
          return next(new ErrorHandler("Please Enter Email & Password", 400));
        }
      
        const user = await User.findOne({ email }).select("+password"); 
      
        if (!user) {
          return next(new ErrorHandler("Invalid email or password", 401));
        }
      
        const isPasswordMatched = await user.comparePassword(password);
        console.log(isPasswordMatched)
      
        if (!isPasswordMatched) {
          return next(new ErrorHandler("Invalid email or password", 401));
        }
      
        sendToken(user, 200, res);
    }catch(err){
       
    res.status(500).json({
      message:err
  })
    }

})



exports.logout = ( (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });


  exports.getuser=(async(req,res,next)=>{
    try{
      console.log(req.user._id)
      const user=await User.findById(req.user._id)
      console.log(user)

     res.status(200).json({
      sucess:true,
      user

     })


    }catch(err){
      res.send({
        err:err
      })
    }

  })

  exports.updateUser = async (req, res) => {
    try {
      const { body } = req;
      const userId = req.params.id; 
      const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id; 
      const deletedUser = await User.findByIdAndDelete(userId); 
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  
  exports.resetSendEmail = async (email) => {
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return {
          success: false,
          message: 'EMAIL NOT FOUND',
        };
      }
  
      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
  
      user.reset_otp = otp;
      await user.save();
  
      const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        secure: true,
        secureConnection: false,
        tls: {
          ciphers: 'SSLv3'
        },
        requireTLS: true,
        port: 465,
        debug: true,
        auth: {
          user: nodeEmail,
          pass: emailPass
        }
      });
  
      const mailOptions = {
        from: 'faizanahmad72560@gmail.com',
        to: user.email,
        subject: 'Reset your password',
        text: `Your OTP for password reset is ${otp}.`
      };
  
      await transporter.sendMail(mailOptions);
  
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  };
  
  

exports.verifyOTP = async (req, res) => {
  try {
    const { reset_otp, email } = req.body;
    const user = await UserModel.findOne({ email: email, reset_otp: reset_otp });

    if (!user) {
      return res.json({
        message: 'Please enter the correct OTP',
      });
    } else {
      res.json({
        message: 'VERIFIED',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user) {
      user.password = password;
      await user.save();
      return res.json({
        message: 'Password changed successfully',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
  
  
  
  
  

