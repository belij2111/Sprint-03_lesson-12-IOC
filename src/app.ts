import cors from "cors"
import express from "express"
import {Request, Response} from 'express';

export const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res
        .status(200)
        .json({version: '1.0'})
})