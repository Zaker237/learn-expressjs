import mongoose, { Schema, model, Types } from "mongoose";

export interface IProjectMember {
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    admin?: boolean;
}

const ProjectMemberSchema = new Schema<IProjectMember> ({
    projectId:{type:Schema.Types.ObjectId, ref:"Project", required:true},
    userId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    admin: {type: Boolean, default: false }
},
{ timestamps: true }
);

export const ProjectMember = model<IProjectMember>("ProjectMember", ProjectMemberSchema);