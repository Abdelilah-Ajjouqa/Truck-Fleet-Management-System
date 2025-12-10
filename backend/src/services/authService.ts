import User from "../models/User.js";
import { UserType } from "../types/userTypes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {

    private static generateToken(user: UserType): string {
        const secret: string | undefined = process.env.JWT_SECRET
        if (!secret) throw new Error('token generator failed, check your variable');

        return jwt.sign(
            { id: user._id, role: user.role },
            secret,
            { expiresIn: "1d" }
        )
    }

    static async register(userData: UserType): Promise<UserType> {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const newUser = await User.create(userData);
        return newUser;
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = this.generateToken(user);

        return { user, token };
    }
}

export default AuthService;