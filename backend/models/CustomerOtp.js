import mongoose from 'mongoose';

const customerOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    resendCount: {
        type: Number,
        default: 1,
    },
    lastSentAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const CustomerOtp = mongoose.models.CustomerOtp || mongoose.model('CustomerOtp', customerOtpSchema);
export default CustomerOtp;