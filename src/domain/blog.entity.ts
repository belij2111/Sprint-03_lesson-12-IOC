import mongoose, {Schema} from "mongoose";
import {BlogDBType} from "../db/blog-db-type";
import {SETTINGS} from "../settings";

export const BlogSchema = new mongoose.Schema<BlogDBType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})

export const BlogModel = mongoose.model<BlogDBType>(SETTINGS.COLLECTION_NAME.BLOG, BlogSchema)