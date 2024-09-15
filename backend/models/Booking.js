// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//    {
//       userId: {
//          type: String
//       },
//       userEmail: {
//          type: String
//       },
//       tourName: {
//          type: String,
//          required: true,
//       },
//       fullName: {
//          type: String,
//          required: true,
//       },
//       guestSize: {
//          type: Number,
//          required: true
//       },
//       phone: {
//          type: Number,
//          required: true
//       },
//       bookAt: {
//          type: Date,
//          required: true
//       },
      
//    },
//    { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);



import mongoose from "mongoose";
import Counter from "../models/counterModel.js"; // Import the counter model

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    bookAt: {
      type: Date,
      required: true,
    },
    tourId: {
      type: Number,
      unique: true, // Ensure tourId is unique
    },
    hotelPreference: {
      type: String,
      enum: ['luxury', 'quality', 'basic'], // Allowed values for hotel preference
      required: true, // Set as required if it's a must-have
    },
    travelPreference: {
      type: String,
      enum: ['flight', 'train', 'car'], // Allowed values for travel preference
      required: true, // Set as required if it's mandatory
    },
  },
  { timestamps: true }
);

// Middleware to auto-increment tourId before saving
bookingSchema.pre("save", async function (next) {
  const booking = this;

  if (!booking.isNew) {
    // If the document is not new, skip the increment
    return next();
  }

  try {
    // Find and update the counter in a single step
    const counter = await Counter.findOneAndUpdate(
      { id: "tourId" }, // Find the counter document for "tourId"
      { $inc: { seq: 1 } }, // Increment the sequence by 1
      { new: true, upsert: true } // Return the updated document or create it if it doesn't exist
    );

    // Set the tourId in the booking document
    booking.tourId = counter.seq;
    next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model("Booking", bookingSchema);
