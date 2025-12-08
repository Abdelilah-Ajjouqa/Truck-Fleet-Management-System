import express from "express";
import type { Request, Response } from "express";
import MongodbConnection from "./config/MongodbConnection.js";
import dotenv from 'dotenv';


dotenv.config()
const app = express();
const dbUrl = process.env.MONGO_URL;
const db = new MongodbConnection(dbUrl);
const port = "3002";

db.connect();
app.use(express.json())


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
    console.log("Response sent");
});


process.once('SIGINT', db.disconnect)

app.listen(port, () => {
    console.log(`app running on : http://localhost:${port}/`);
});