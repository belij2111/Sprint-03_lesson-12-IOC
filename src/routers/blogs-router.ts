import {Router} from "express"
import {
    createBlogController,
    getBlogByIdController,
    getBlogsController, updateBlogByIdController,
} from "../controllers/blogs-controller"

export const blogsRouter = Router()

blogsRouter.post('/', createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', updateBlogByIdController)
