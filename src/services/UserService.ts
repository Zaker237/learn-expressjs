import { IUser, User } from "../models/UserModel";
import { UserResource } from "../resources/";
import mongoose, { Types } from "mongoose";


export default class UserService {
    public static async getAllUsers(): Promise<UserResource[]> {
        const users = await User.find().exec();
        const userResponse: UserResource[] = [];
        for (const user of users) {
            const resource = this.getUserAsUserResource(user);
            userResponse.push(resource);
        }
        return userResponse;
    }

    public static async getUserById(id: string): Promise<UserResource> {
        let user = await User.find({ id: new Types.ObjectId(id) }).exec();
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return this.getUserAsUserResource(User);
    }

    public static async createUser(user: UserResource): Promise<UserResource> {
        const newUser: any = new User({
            username: user.username,
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email,
            googleId: user.googleId,
            admin: user.admin ? true : false
        });
        const existingUser = await User.findOne({ email: newUser.email }).exec()
        if (existingUser) {
            throw new Error("The User already exists.");
        }
        const savedUser: any = await newUser.save();
        return this.getUserAsUserResource(savedUser);
    }

    public static async updateUser(user: UserResource): Promise<UserResource> {
        const existingUser = await User.findById(user.id).exec();
        if (!existingUser) {
            throw new Error("The User does not exist");
        }
        const updatedUser: any = await User.findByIdAndUpdate(
            user.id,
            {
                username: user.username,
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email,
                googleId: user.googleId,
                admin: user.admin ? true : false
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedUser) {
            throw new Error("An Error occurs when updating");
        }
        return this.getUserAsUserResource(updatedUser);
    }

    public static async deleteUser(id: string): Promise<void> {
        try {
            const user = await User.findByIdAndDelete(id).exec();
            if (!user) {
                throw new Error(`User with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error("User could not be deleted.")
        }
    }

    public static getUserAsUserResource(data: any): UserResource {
        const resource: UserResource = {
            id: data.id,
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            googleId: data.googleId,
            admin: data.admin
        }
        return resource;
    }
}