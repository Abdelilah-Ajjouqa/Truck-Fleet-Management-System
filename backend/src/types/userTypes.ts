import { Document } from "mongoose"; //this make Mongoose know that the object has an _id

export type UserType = Document & {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'CHAUFFEUR';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}