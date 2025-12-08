import type { Request, Response, NextFunction } from "express";
import HttpError from "../types/HttpError.js";

const errorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction)=>{
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`Error ${status} - ${message}`);

    res.status(status).json({
        success: false,
        message: message,
    })
}

export default errorMiddleware;