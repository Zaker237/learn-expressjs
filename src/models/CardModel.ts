import { Schema, model, Types } from "mongoose";

export interface ICard {
    createdBy: Types.ObjectId;
    asignTo: Types.ObjectId;
    belongTo: Types.ObjectId,
    inStep: Types.ObjectId,
    title: string;
    description?: string;
}

const CardSchema = new Schema<ICard> ({
    createdBy:{type:Schema.Types.ObjectId, ref:"User", required:true},
    asignTo:{type:Schema.Types.ObjectId, ref:"User", required:true},
    belongTo:{type:Schema.Types.ObjectId, ref:"Project", required:true},
    inStep:{type:Schema.Types.ObjectId, ref:"Step", required:true},
    title: {type: String, required: true },
    description: {type: String, default: ""}
},
{ timestamps: true }
);

export const Card = model<ICard>("Card", CardSchema);