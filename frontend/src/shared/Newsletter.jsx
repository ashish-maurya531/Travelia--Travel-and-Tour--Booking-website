import React from 'react'
import './newsletter.css'
import { Container, Row, Col } from 'reactstrap'
import maleTourist from '../assets/images/male-tourist.png'


const handleClick=()=>{
   alert('Subscribed Successfully!')
   // axios.post(`${BASE_URL}/subscribe`, { email: credentials.email })
   //    .then(response => {
   //       console.log(response)
   //       setCredentials({...credentials, email: '' })
   //    })
   //    .catch(error => {
   //       console.log(error)
   //    }) 
}

const NewsLetter = () => {
   return (
      <section className='newsletter'>
         <Container>
            <Row>
               <Col lg='6'>
                  <div className="newsletter__content">
                     <h2>Subcribe now to get useful traveling information</h2>

                     <div className="newsletter__input">
                        <input type="email" placeholder='Enter your email' />
                        <button className="btn newsletter__btn" onClick={handleClick}>Subcribe</button>
                     </div>
                     <p>"From Dream Destinations to Unforgettable Memories—Let Us Guide You Every Step of the Way."
                     </p>
                  </div>
               </Col>
               <Col lg='6'>
                  <div className="newsletter__img">
                     <img src={maleTourist} alt="" />
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}

export default NewsLetter