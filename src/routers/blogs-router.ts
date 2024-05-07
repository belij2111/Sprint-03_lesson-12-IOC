import {Router} from "express"
import {createBlogController, getBlogByIdController, getBlogsController} from "../controllers/blogs-controller"

export const blogsRouter = Router()

blogsRouter.post('/', createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', getBlogByIdController)
