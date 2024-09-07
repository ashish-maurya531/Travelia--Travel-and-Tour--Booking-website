import React from 'react'
import Slider from 'react-slick'
import ava01 from '../../assets/images/ava-1.jpg'
import ava02 from '../../assets/images/ava-2.jpg'
import ava03 from '../../assets/images/ava-3.jpg'

const Testimonials = () => {
   const settings = {
      dots:true,
      infinite:true,
      autoplay:true,
      speed:1000,
      swipeToSlide:true,
      autoplaySpeed:2000,
      slidesToShow:3,

      responsive: [
         {
            breakpoint: 992,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
               infinite: true,
               dots: true,
            },
            breakpoint: 576,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
               infinite: true,
               dots: true,
            },
         }
      ]
   }

   return <Slider {...settings}>
      <div className="testimonial py-4 px-3">
         <p>“A Journey Beyond Expectations” “Traveling with this site was a game-changer for me. The seamless booking process and tailored recommendations made our trip to Japan truly unforgettable. Every detail was meticulously planned, and the local guides were fantastic. I can’t wait to use their services for our next adventure!”
         </p>

         <div className='d-flex align-items-center gap-4 mt-3'>
            <img src={ava01} className='w-25 h-25 rounded-2' alt="" />
            <div>
               <h6 className='mb-0 mt-3'>John Doe</h6>
               <p>Customer</p>
            </div>
         </div> 
      </div>

      <div className="testimonial py-4 px-3">
         <p>“I was blown away by the personalized service we received. The itinerary was spot-on, and the accommodations were top-notch. From the initial planning stages to the final destination, everything was handled with care and precision. This travel service has set a new standard for our vacations!”
         </p>

         <div className='d-flex align-items-center gap-4 mt-3'>
            <img src={ava02} className='w-25 h-25 rounded-2' alt="" />
            <div>
               <h6 className='mb-0 mt-3'>Lia Franklin</h6>
               <p>Customer</p>
            </div>
         </div> 
      </div>

      <div className="testimonial py-4 px-3">
         <p>“Stress-Free Travel Planning” “I’ve never experienced such effortless travel planning. The user-friendly interface and responsive customer support made booking our European tour a breeze. We were impressed with the detailed guides and insider tips that made our trip so special. Highly recommend for anyone looking to travel smartly and stress-free.”
         </p>

         <div className='d-flex align-items-center gap-4 mt-3'>
            <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
            <div>
               <h6 className='mb-0 mt-3'>John Doe</h6>
               <p>Customer</p>
            </div>
         </div> 
      </div>

      <div className="testimonial py-4 px-3">
         <p>“A True Travel Partner” “What sets this travel service apart is their dedication to customer satisfaction. They went above and beyond to ensure our family trip to Costa Rica was nothing short of spectacular. From organizing excursions to handling last-minute changes, their team was always there to assist. We’ll definitely be returning for our next holiday!”
         </p>

         <div className='d-flex align-items-center gap-4 mt-3'>
            <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
            <div>
               <h6 className='mb-0 mt-3'>John Doe</h6>
               <p>Customer</p>
            </div>
         </div> 
      </div>
   </Slider>
}

export default Testimonials