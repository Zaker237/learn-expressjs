import { Schema, model, Types } from "mongoose";

export interface IComment {
    createdBy: Types.ObjectId;
    belongTo: Types.ObjectId,
    text: string;
}

const CommentSchema = new Schema<IComment> ({
    createdBy:{type:Schema.Types.ObjectId, ref:"User", required:true},
    belongTo:{type:Schema.Types.ObjectId, ref:"Card", required:true},
    text: {type: String, required: true }
},
{ timestamps: true }
);

export const Comment = model<IComment>("Comment", CommentSchema);