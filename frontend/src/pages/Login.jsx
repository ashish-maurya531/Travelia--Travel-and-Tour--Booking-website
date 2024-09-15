import React, { useContext, useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../utils/config'
import axios from 'axios'

const Login = () => {
   const [credentials, setCredentials] = useState({
      email: undefined,
      password: undefined
   })
   const [isSendOtp, setIsSendOtp] = useState(false)
   const [isLoading, setIsLoading] = useState(false)
   const [isVerify, setIsVerify] = useState(false)
   

   const {dispatch} = useContext(AuthContext)
   const navigate = useNavigate()

   const handleChange = e => {
      setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
   }

   const handleClick = async () => {

      dispatch({type:'LOGIN_START'})

      try {
         const res = await fetch(`${BASE_URL}/auth/login`, {
            method:'post',
            headers: {
               'content-type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify(credentials)
         })

         const result = await res.json()
         if(!res.ok) alert(result.message)
         console.log(result.data)

         dispatch({type:"LOGIN_SUCCESS", payload:result.data})
         navigate('/')
      } catch(err) {
         dispatch({type:"LOGIN_FAILURE", payload:err.message})
      }
   }

   const sendOtpRequest = async () => {
      setIsLoading(true)
      try {
      const response = await axios.post(`${BASE_URL}/auth/sendOtp`, {
         email: credentials.email
      }
      )
      console.log("otp,response", response)
      alert("OTP sent successfully")
      setIsLoading(false)
      setIsSendOtp(true)
      } catch(err) {
         setIsLoading(false)
         alert(err.message)
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
      await handleClick()

      } catch(err) {
         setIsLoading(false)
         alert(err.message)
      }
   }

   return (
      <section>
         <Container>
            <Row>
               <Col lg='8' className='m-auto'>
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={loginImg} alt="" />
                     </div>

                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="" />
                        </div>
                        <h2>Login</h2>

                        <Form onSubmit={handleClick}>
                           {
                              !isSendOtp && (
                                 <>
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
                              isSendOtp? (
                                 <div>
                                    <input type="text" placeholder='OTP' id='otp' onChange={handleChange} required />
                                    <Button 
                                    disabled={isLoading}
                                    style={{
                                       marginTop: '10px',
                                       marginBottom: '10px'
                                    }} className='btn secondary__btn auth__btn' 
                                    onClick={handleOtp}
                                    >
                                   {
                                     isLoading? 'Verifying otp...' : 'Verify OTP' 
  
                                   }
                                    </Button>
                                 </div>
                              ) : (
                                 <Button disabled={isLoading} className='btn secondary__btn auth__btn' 
                                 onClick={sendOtpRequest}
                                 >
                                    {
                                       isLoading? 'Sending OTP...' : 'Send OTP' 
 
                                    }
                                 </Button>
                              )}
                           
                          
                        </Form>
                        <p>Don't have an account? <Link to='/register'>Create</Link></p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}

export default Login