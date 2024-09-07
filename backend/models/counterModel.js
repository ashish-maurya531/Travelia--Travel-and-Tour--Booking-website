import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  }
});

// Export the Counter model
const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
