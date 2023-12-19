import { Schema, model } from "mongoose";

export interface IUser{
    username: string;
    firstname?: string;
    lastname?: string;
    email: string;
    googleId: string;
    admin?: boolean;
}

const Userschema = new Schema <IUser>({
    username: {type: String, required: true, unique: true},
    firstname: {type: String, default: ""},
    lastname: {type: String, default: ""},
    email: {type: String, required: true, unique: true},
    googleId: {type: String, required: true, unique: true},
    admin: {type: Boolean, default: false},
},
   {timestamps: true},
);

export const User = model<IUser>("User", Userschema);