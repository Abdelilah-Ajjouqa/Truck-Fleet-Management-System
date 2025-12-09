import User from "../models/User.js";
import { UserType } from "../types/userTypes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
    static async register(userData: Partial<UserType>): Promise<UserType> {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        const newUser = await User.create(userData);
        return newUser;
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        return { user, token };
    }
}

export default AuthService;