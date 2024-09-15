import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import registerImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../utils/config'
import axios from 'axios'

const Register = () => {
   const [credentials, setCredentials] = useState({
      userName: undefined,
      email: undefined,
      password: undefined,
      otp: undefined
   })
   const [otpCheck, setOtpCheck] = useState(false)
   const [isVerify, setIsVerify] = useState(true)
   const [isLoading, setIsLoading] = useState(false)

   const {dispatch} = useContext(AuthContext)
   const navigate = useNavigate()

   const handleChange = e => {
      setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
   }

   const handleClick = async e => {
      e.preventDefault()
      setIsLoading(true)

      try {
         const res = await fetch(`${BASE_URL}/auth/register`, {
            method:'post',
            headers: {
               'content-type':'application/json'
            },
            body: JSON.stringify(credentials)
         })
         const result = await res.json()
         console.log("result", result)
         if(!res.ok) alert(result.message)
            if (result?.success === true) {
               setOtpCheck(true)
               setIsLoading(false)
            }
            setIsLoading(false)
          
      } catch(err) {
         alert(err.message)
         setIsLoading(false)
         setOtpCheck(false)
      }
   }

   const handleOtp = async e => {
      e.preventDefault()
      setIsLoading(true)
      try {
      const response = await axios.post(`${BASE_URL}/auth/verify`, {
         email: credentials.email,
         otp: credentials.otp
      }
      )
      console.log("otp,response", response)
      alert("otp verified successully")
      setIsVerify(true)
      setIsLoading(false)
      dispatch({type:'REGISTER_SUCCESS'})
      navigate('/login')
      } catch(err) {
         setIsLoading(false)
         alert(err.message)
      }
   }
console.log("otpcheck", otpCheck)

   return (
      <section>
         <Container>
            <Row>
               <Col lg='8' className='m-auto'>
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={registerImg} alt="" />
                     </div>

                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="" />
                        </div>
                        <h2>Register</h2>

                        <Form onSubmit={handleClick}>
                           {
                              !otpCheck && (
                                 <>
                                  <FormGroup>
                              <input type="text" placeholder='Username' id='username' onChange={handleChange} required />
                           </FormGroup>
                           <FormGroup>
                              <input type="email" placeholder='Email' id='email' onChange={handleChange} required />
                           </FormGroup>
                           <FormGroup>
                              <input type="password" placeholder='Password' id='password' onChange={handleChange} required />
                           </FormGroup>
                                 </>
                              )
                           }
                          
                           {
                              otpCheck && (
                                 <div>
                                    <p>Enter OTP sent to your email: {credentials.email}</p>
                                    <FormGroup>
                              <input type="text" placeholder='OTP' id='otp' onChange={handleChange} required />
                           </FormGroup>
                                       <Button className='btn secondary__btn auth__btn' 
                                       onClick={handleOtp}
                                       >
                                          {
                                             isLoading ? (
                                                "verifying otp..."
                                             ) : "Verify OTP"
                                          }
                                       </Button>
                                 </div>
                              )
  
                           }
                         
                           {
                              otpCheck? (
                                 
                                 
                               null
                                 
                              ) : (
                                 <Button className='btn secondary__btn auth__btn' type='submit'>
                                    {
                                       isLoading ? "Loading..." : "Next"
                                    }
                                 </Button>
                              )
                           }
                           {/* <Button className='btn secondary__btn auth__btn' type='submit'>Create Account</Button> */}
                        </Form>
                        <p>Already have an account? <Link to='/login'>Login</Link></p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}

export default Register



















