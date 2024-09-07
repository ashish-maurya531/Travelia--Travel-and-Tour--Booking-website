import Booking from './../models/Booking.js'


// create new booking
export const createBooking = async(req,res) => {
   const newBooking = new Booking(req.body)

   try {
      const savedBooking = await newBooking.save()

      res.status(200).json({success:true, message:"Your tour is booked!", data:savedBooking})
   } catch (error) {
      res.status(500).json({success:true, message:"Internal server error!"})
   }
}

// get single booking
export const getBooking = async(req,res) => {
   const id = req.params.id
   console.log(id)
   
   try {
      const book = await Booking.find({userId:id})
      console.log(book);

      res.status(200).json({success:true, message:"Successful!", data:book})
   } catch (error) {
      res.status(404).json({success:true, message:"Not Found!"})
   }
} 

//delete booking
export const deleteBooking = async(req,res) => {
   const tourId = req.params.id
   console.log(tourId)
   
   try {
      const deletebook = await Booking.deleteOne({tourId:tourId})
      console.log(deletebook);

      res.status(200).json({success:true, message:"Successful!", data:deletebook})
   } catch (error) {
      res.status(404).json({success:true, message:"Not able to delete"})
   }
} 





// get all booking
export const getAllBooking = async(req,res) => {
   
   try {
      const books = await Booking.find()

      res.status(200).json({success:true, message:"Successful!", data:books})
   } catch (error) {
      res.status(500).json({success:true, message:"Internal server error!"})
   }
} 