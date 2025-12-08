import express from "express";
import type { Request, Response } from "express";
const app = express();
const port = "3002";

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
    console.log("Response sent");
});

app.listen(port, () => {
    console.log(`app running on : http://localhost:${port}/`);
});