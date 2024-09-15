import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    otp: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
  },
  { timestamps: true }
);

// otp delete aafter 5 minutes

otpSchema.index({ createdAt: 1 }, { expiresAfterSeconds: 300 }); // 5 minutes

export default mongoose.model("Otp", otpSchema);
