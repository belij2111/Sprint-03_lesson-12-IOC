import {InputPostType} from "../../src/types/post-types";

export const postDto = {
    validPostDto(id: string, count?: number): InputPostType {
        return {
            title: `Post${count}`,
            shortDescription: `This is a new post${count}`,
            content: `This is the content of post${count}`,
            blogId: id
        }
    },
    invalidBlogsDto(id: string, count?: number): InputPostType {
        return {
            title: `555555555555555555555555555555555555Post${count}`,
            shortDescription: `This is a new post${count}`,
            content: `This is the content of post${count}`,
            blogId: id
        }
    }
}