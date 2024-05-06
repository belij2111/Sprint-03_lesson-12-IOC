import {Router} from "express"
import {createBlogController, getBlogsController} from "../controllers/blogs-controller"

export const blogsRouter = Router()

blogsRouter.post('/', createBlogController)
blogsRouter.get('/', getBlogsController)
