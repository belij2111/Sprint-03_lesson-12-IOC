import cors from "cors"
import express from "express"
import {Request, Response} from 'express';
import {blogsRouter} from "./routers/blogs-router";
import {SETTINGS} from "./settings";
import {postsRouter} from "./routers/posts-router";

export const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res
        .status(200)
        .json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)