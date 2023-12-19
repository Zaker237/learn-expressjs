import { Schema, model, Types } from "mongoose";

export interface IProject {
    owner: Types.ObjectId;
    name: string;
    description?: string;
    startAt: Date;
    endsAt: Date;
    public?: boolean;
    closed?: boolean;
    githublink?: string;
    updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject> ({
    owner:{type:Schema.Types.ObjectId, ref:"User", required:true},
    name: {type: String, required: true },
    description: {type: String, default: ""},
    startAt: {type: Date, required: true },
    endsAt: {type: Date, required: true },
    public: {type: Boolean, default: false},
    closed: {type: Boolean, default: false},
    githublink: {type: String, default: ""},
},
{ timestamps: true }
);

export const Project = model<IProject>("Project", ProjectSchema);