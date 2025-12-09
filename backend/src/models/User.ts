import mongoose from "mongoose";
import { UserType } from "../types/userTypes.js";

const userSchema = new mongoose.Schema<UserType>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'CHAUFFEUR'],
        default: 'CHAUFFEUR'
    },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

const User = mongoose.model<UserType>('User', userSchema);

export default User;