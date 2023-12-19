import { IComment, Comment } from "../models/CommentModel";
import { CommentResource } from "../resources/";
import mongoose, { Types } from "mongoose";
import { User } from "../models/UserModel";
import { Card } from "../models/CardModel";


export default class CommentService {
    public static async getAllComments(): Promise<CommentResource[]> {
        const comments = await Comment.find().exec();
        const commentResponse: CommentResource[] = [];
        for (const comment of comments) {
            const resource = this.getCommentAsCommentResource(comment);
            commentResponse.push(resource);
        }
        return commentResponse;
    }

    public static async getCommentsCreatedByUser(userId: string): Promise<CommentResource[]> {
        let user = await User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const comments = await Comment.find({
            createdBy: new Types.ObjectId(userId)
        }).exec();
        const commentResponse: CommentResource[] = [];
        for (const comment of comments) {
            const resource = this.getCommentAsCommentResource(comment);
            commentResponse.push(resource)
        }
        return commentResponse;
    }

    public static async getCommentsBelongToCard(cardId: string): Promise<CommentResource[]> {
        let card = await Card.findById(cardId).exec();
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }
        const comments = await Comment.find({
            belongTo: new Types.ObjectId(cardId)
        }).exec();
        const commentResponse: CommentResource[] = [];
        for (const comment of comments) {
            const resource = this.getCommentAsCommentResource(comment);
            commentResponse.push(resource)
        }
        return commentResponse;
    }

    public static async getCommentById(id: string): Promise<CommentResource> {
        let comment = await Comment.findById(id).exec();
        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }
        return this.getCommentAsCommentResource(comment);
    }

    public static async createComment(comment: CommentResource): Promise<CommentResource> {
        let user = await User.findById(comment.createdBy).exec();
        if (!user) {
            throw new Error(`User with ID ${comment.createdBy} not found`);
        }
        let card = await Card.findById(comment.belongTo).exec();
        if (!card) {
            throw new Error(`Card with ID ${comment.belongTo} not found`);
        }
        const newComment: any = new Comment({
            createdBy: new Types.ObjectId(comment.createdBy),
            belongTo: new Types.ObjectId(comment.belongTo),
            text: comment.text
        });
        const existingComment = await Comment.findOne({ createdBy: newComment.createdBy, belongTo: newComment.belongTo }).exec()
        if (existingComment) {
            throw new Error("The Comment already exists.");
        }
        const savedComment: any = await newComment.save();
        return this.getCommentAsCommentResource(savedComment);
    }

    public static async updateComment(comment: CommentResource): Promise<CommentResource> {
        let user = await User.findById(comment.createdBy).exec();
        if (!user) {
            throw new Error(`User with ID ${comment.createdBy} not found`);
        }
        const existingComment = await Comment.findById(comment.id).exec();
        if (!existingComment) {
            throw new Error("The step does not exist");
        }
        let card = await Card.findById(comment.belongTo).exec();
        if (!card) {
            throw new Error(`Catd with ID ${comment.belongTo} not found`);
        }
        const updatedComment: any = await Comment.findByIdAndUpdate(
            comment.id,
            {
                text: comment.text
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedComment) {
            throw new Error("An Error occurs when updating");
        }
        return this.getCommentAsCommentResource(updatedComment);
    }

    public static async deleteComment(id: string): Promise<void> {
        try {
            const comment = await Comment.findByIdAndDelete(id).exec();
            if (!comment) {
                throw new Error(`Comment with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error("Comment could not be deleted.")
        }
    }

    public static getCommentAsCommentResource(comment: any): CommentResource {
        const resource: CommentResource = {
            id: comment.id,
            createdBy: comment.createdBy.toString(),
            belongTo: comment.belongTo.toString(),
            text: comment.text
        }
        return resource;
    }
}