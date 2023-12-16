import mongoose, { Schema, model, Types } from "mongoose";

export interface IProjectStep {
    projectId: Types.ObjectId;
    stepId: Types.ObjectId;
    position: number;
}

const ProjectStepSchema = new Schema<IProjectStep> ({
    projectId:{type:Schema.Types.ObjectId, ref:"Project", required:true},
    stepId:{type:Schema.Types.ObjectId, ref:"Step", required:true},
    position: {type: Number, required: true }
},
{ timestamps: true }
);

export const ProjectStep = model<IProjectStep>("ProjectStep", ProjectStepSchema);