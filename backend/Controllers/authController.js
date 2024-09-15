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
      text: `<!DOCTYPE html>
            <html lang="en">
            <head>
               <meta charset="UTF-8">
               <meta http-equiv="X-UA-Compatible" content="IE=edge">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>OTP Verification</title>
               <style>
                  body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                  }
                  .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                        text-align: center;
                        background-color: #0066cc;
                        padding: 10px 0;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                  }
                  .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                  }
                  .content {
                        padding: 20px;
                        text-align: center;
                  }
                  .content h2 {
                        font-size: 22px;
                        color: #333;
                        margin-bottom: 10px;
                  }
                  .content p {
                        font-size: 16px;
                        color: #666;
                  }
                  .otp-box {
                        font-size: 24px;
                        font-weight: bold;
                        color: #0066cc;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        padding: 15px;
                        margin: 20px 0;
                        display: inline-block;
                  }
                  .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #999;
                  }
                  .footer a {
                        color: #0066cc;
                        text-decoration: none;
                  }
               </style>
            </head>
            <body>

               <div class="container">
                  <div class="header">
                        <h1>Travelia - OTP Verification</h1>
                  </div>
                  <div class="content">
                        <h2>Verify Your Account</h2>
                        <p>Thank you for registering with Travelia! To complete the registration process, please use the following OTP code to verify your email:</p>
                        <div class="otp-box">{${OTP_CODE}}</div>
                        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                  </div>
                  <div class="footer">
                        <p>Need help? Contact our support team at <a href="mailto:support@travelia.com">support@travelia.com</a></p>
                  </div>
               </div>

            </body>
            </html>
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
      text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login OTP</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #0066cc;
            padding: 10px 0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            color: #666;
        }
        .otp-box {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            display: inline-block;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #0066cc;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>Travelia - Login OTP</h1>
        </div>
        <div class="content">
            <h2>Login Verification Code</h2>
            <p>You have requested to log in to your Travelia account. Please use the following OTP code to complete your login:</p>
            <div class="otp-box">{${OTP_CODE}}</div>
            <p>This OTP is valid for 10 minutes. If you did not request this, please disregard this email.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:support@travelia.com">support@travelia.com</a></p>
        </div>
    </div>

</body>
</html>
`
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
         text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #28a745;
            padding: 10px 0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #28a745;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>Welcome to Travelia!</h1>
        </div>
        <div class="content">
            <h2>Account Created Successfully</h2>
            <p>Dear ${userData?.username},</p>
            <p>Your account at Travelia has been created successfully. You can now log in and start exploring our services.</p>
            <p>Thank you for joining us!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to <a href="mailto:support@travelia.com">contact us</a>.</p>
        </div>
    </div>

</body>
</html>
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
      text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login OTP</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #0066cc;
            padding: 10px 0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            color: #666;
        }
        .otp-box {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            display: inline-block;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .footer a {
            color: #0066cc;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>Travelia - Login OTP</h1>
        </div>
        <div class="content">
            <h2>Login Verification Code</h2>
            <p>You have requested to log in to your Travelia account. Please use the following OTP code to complete your login:</p>
            <div class="otp-box">{${OTP_CODE}}</div>
            <p>This OTP is valid for 10 minutes. If you did not request this, please disregard this email.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:support@travelia.com">support@travelia.com</a></p>
        </div>
    </div>

</body>
</html>
`
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