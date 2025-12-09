import AuthService from "../services/authService.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("register()", () => {
        it("should hash password and create user", async () => {
            const userData = { email: "test@test.com", password: "password123" };
            
            (User.findOne as jest.Mock).mockResolvedValue(null); 
            (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password_123");
            
            // Mock created user
            (User.create as jest.Mock).mockResolvedValue({ 
                _id: "user_id", 
                ...userData, 
                password: "hashed_password_123" 
            });

            const result = await AuthService.register(userData as any);

            expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
                password: "hashed_password_123"
            }));
            expect(result).toHaveProperty("_id", "user_id");
        });

        it("should throw error if user already exists", async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ _id: "existing_id" });

            await expect(AuthService.register({ email: "exists@test.com" } as any))
                .rejects
                .toThrow("User already exists");
        });
    });

    describe("login()", () => {
        it("should return token if password matches", async () => {
            const mockUser = { 
                _id: "user_id", 
                email: "test@test.com", 
                password: "hashed_secret",
                role: "DRIVER" 
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("fake_token_jwt");

            const result = await AuthService.login("test@test.com", "password123");

            expect(result).toHaveProperty("token", "fake_token_jwt");
            expect(result.user).toHaveProperty("email", "test@test.com");
        });

        it("should throw error if password wrong", async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ password: "hashed_secret" });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(AuthService.login("test@test.com", "wrong_pass"))
                .rejects
                .toThrow("Invalid credentials");
        });
    });
});