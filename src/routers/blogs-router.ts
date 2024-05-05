import {Router} from "express"
import {createBlogController} from "../controllers/blogs-controller"

export const blogsRouter = Router()

blogsRouter.post('/', createBlogController)
