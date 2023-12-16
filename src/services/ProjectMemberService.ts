import { ProjectMember } from "../models/ProjectMemberModel";
import { User } from "../models/UserModel";
import { Project } from "../models/ProjectModel";
import { UserResource } from "../resources/";
import { Types } from "mongoose";
import UserService from "./UserService";


export default class ProjectMemberService {
    public static async getAllMembersInProject(projectId: string): Promise<UserResource[]> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        const projectMembers = await ProjectMember.find({
            projectId: projectId
        }).exec();
        const memberResponse: UserResource[] = [];
        for (const pMember of projectMembers) {
            const member = await UserService.getUserById(pMember.id!);
            memberResponse.push(member);
        }
        return memberResponse;
    }

    public static async addMemberToProject(projectId: string, userId: string, admin?: boolean): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let user = await User.find({ id: new Types.ObjectId(userId) }).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const existingProjectMember = await ProjectMember.find({
            projectId: new Types.ObjectId(projectId),
            userId: new Types.ObjectId(userId)
        }).exec();
        if (existingProjectMember) {
            throw new Error("The User is already member of the project.");
        }
        const pMember = new ProjectMember({
            projectId: new Types.ObjectId(projectId),
            MemberId: new Types.ObjectId(userId),
            admin: admin ? admin: false
        });
        try {
            pMember.save();
        } catch (error) {
            throw Error("An Error occurs");
        }
    }

    public static async removeMemberFromProject(projectId: string, userId: string): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let user = await User.find({ id: new Types.ObjectId(userId) }).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const projectMember = await ProjectMember.findByIdAndDelete({
            projectId: new Types.ObjectId(projectId),
            userId: new Types.ObjectId(userId)
        }).exec();
        if (!projectMember) {
            throw new Error("The User is nots in the project.");
        }
    }

    public static async updatePositionOfMemberInProject(projectId: string, userId: string, admin?: boolean): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let user = await User.find({ id: new Types.ObjectId(userId) }).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const projectMember = await ProjectMember.findOne({
            projectId: new Types.ObjectId(projectId),
            userId: new Types.ObjectId(userId)
        }).exec();
        if (!projectMember) {
            throw new Error("The User is not yet in the project.");
        }
        const newProjectMember = new ProjectMember({
            projectId: new Types.ObjectId(projectId),
            MemberId: new Types.ObjectId(userId),
            admin: admin? admin: false
        });
        try {
            await newProjectMember.save();
        } catch (e) {
            throw new Error("An Error occurs.");
        }
    }
}