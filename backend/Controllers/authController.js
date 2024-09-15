import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from "../utils/sendEmails.js";
import Otp from "../models/Otp.js";

// user register
export const register = async (req, res) => {
   try {
      const newOtp = Math.floor(100000 + Math.random() * 900000)

      const {username, email, password, photo} = req.body;
      if(!username || !email || !password) {
         return res.status(400).json({ success: false, message: "Please provide all fields." });
      }
      console.log("req", req.body)
      const checkEmail = await User.findOne({
         email: email,
      }).lean();
      console.log("checkVerify", checkEmail);
      if(checkEmail && checkEmail.verified === true) {
         return res.status(400).json({ success: false, message: "Email already exists." });
      } else if(checkEmail?.verified === false) {
         const checkOTP = await Otp.findOne({
            email: email
         });
         // delete otp
         if(checkOTP) {
            await Otp.deleteOne({
               email: email
            })
         }
         // save new otp
         const otpsave = new Otp({
            email: email,
            otp: newOtp
         });
         await otpsave.save()
          // send email with otp
   await sendEmail({
      to: email,
      subject: "Verification Code",
      text: `Your Account is not verified. This is your verification code:  </br>
      <h1> ${newOtp} </h1>
      </br> 
      Please use this code to verify your account. THANK YOU!
      `
   })

         res.status(200).json({
            success: true,
            message: "Your account is not verified. Please verify it. OTP SEND SUCCESSFULLY!"
         })
         
      } else  {
   //hashing password
   const salt = bcrypt.genSaltSync(10)
   const hash = bcrypt.hashSync(password, salt)

   const newUser = new User({
      username: username,
      email: email,
      password: hash,
      photo: photo
   })

   await newUser.save()

   const otpsave = new Otp({
      email: newUser.email,
      otp: newOtp
   });
   await otpsave.save()


   // send email with otp
   await sendEmail({
      to: newUser.email,
      subject: "Verification Code",
      text: `This is your verification code: ${newOtp}`
   })


   res.status(200).json({ success: true, message: "Otp send to you email." })
      }
   
   } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: error?.message })
   }
}

// email verify
export const verify = async (req, res) => {
   try {
      const {email, otp} = req?.body
      console.log("req", req.body)
      const data = await Otp.findOne({
         email: email,
         otp: otp
       })
       const userData = await User.findOne({ email: email })
       console.log("userData", userData)
console.log("data", data)
      // if user doesn't exist
      if (!data) {
         return res.status(404).json({ success: false, message: 'Invalid OTP' })
      }

      const user = await User.findOneAndUpdate(
         { email: email },
         { verified: true }
      )
      await Otp.deleteOne({
         email: email,
         otp: otp
      })
      await sendEmail({
         to: email,
         subject: "Accounted Created",
         text: `Welcome ${userData?.username}, 
         </br>
         Your account has been created successfully.
         `
      })

      res.status(200).json({ success: true, message: "OTP verified successfully!!" })

   } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
   }
}

// send email ootp for login
export const sendOtpForLogin = async (req, res) => {
   try {
      const { email } = req.body
      console.log("req", req.body)
      const checkEmail = await User.findOne({
         email: email,
      }).lean();
      console.log("checkVerify", checkEmail);
      if(!checkEmail) {
         return res.status(400).json({ success: false, message: "Email not found." });
      } else if(checkEmail?.verified === false) {
         return res.status(400).json({ success: false, message: "Please verify your email first." });
      } else {
         const newOtp = Math.floor(100000 + Math.random() * 900000)
         console.log("newOtp", newOtp)
         // delete otp
         const checkOTP = await Otp.findOne({ email, otp: newOtp });
         if(checkOTP) {
            await Otp.deleteOne({
               email: email,
               otp: checkOTP.otp
            })
         }
         // save new otp
         const otpsave = new Otp({
            email: email,
            otp: newOtp
         });
         await otpsave.save()
          // send email with otp
   await sendEmail({
      to: email,
      subject: "Verification Code",
      text: `This is your verification code: ${newOtp}`
   })
   res.status(200).json({ success: true, message: "Otp send to you email." })
      }
      
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
   }
}

// user login
export const login = async (req, res) => {
   try {
      const email = req.body.email
      const user = await User.findOne({ email })

      // if user doesn't exist
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found!' })
      }

      // if user is exist then check the passord or compare the password
      const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

      // if password incorrect 
      if (!checkCorrectPassword) {
         return res.status(401).json({ susccess: false, message: "Incorrect email or password!" })
      }

      const { password, role, ...rest } = user._doc

      // create jwt token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn:"15d" })

      // set token in the browser cookies and send the response to the client
      res.cookie('accessToken', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production', // Ensure cookie is sent over HTTPS in production
         sameSite: 'none', // Allows cross-site cookies for cross-origin requests
         expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days in ms
      }).status(200).json({token, data:{...rest}, role})
   } catch (error) {
      console.log(error)
      res.status(500).json({ susccess: false, message: "Failed to login" })
   }
}