import mongoose, { Schema, model, Types } from "mongoose";

export interface IStep {
    createdBy: Types.ObjectId;
    name: string;
    description?: string;
}

const StepSchema = new Schema<IStep> ({
    createdBy:{type:Schema.Types.ObjectId, ref:"User", required:true},
    name: {type: String, required: true },
    description: {type: String, default: ""}
},
{ timestamps: true }
);

export const Step = model<IStep>("Step", StepSchema);