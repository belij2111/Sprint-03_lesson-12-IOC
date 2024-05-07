import {Router} from "express"
import {
    createBlogController, deleteBlogByIdController,
    getBlogByIdController,
    getBlogsController, updateBlogByIdController,
} from "../controllers/blogs-controller"

export const blogsRouter = Router()

blogsRouter.post('/', createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', updateBlogByIdController)
blogsRouter.delete('/:id', deleteBlogByIdController)
