import { Project } from "../models/ProjectModel";
import { ProjectResource } from "../resources/";
import { Types } from "mongoose";
import { User } from "../models/UserModel";


export default class ProjectService {
    public static async getAllProjects(): Promise<ProjectResource[]> {
        const projects = await Project.find().exec();
        const projectResponse: ProjectResource[] = [];
        for (const project of projects) {
            const resource = this.getProjectAsProjectResource(project);
            projectResponse.push(resource);
        }
        return projectResponse;
    }

    public static async getProjectsCreatedByUser(userId: string): Promise<ProjectResource[]> {
        let user = await User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const projects = await Project.find({
            owner: new Types.ObjectId(userId)
        }).exec();

        const projectResponse: ProjectResource[] = [];
        for (const project of projects) {
            const resource = this.getProjectAsProjectResource(project);
            projectResponse.push(resource)
        }
        return projectResponse;
    }

    public static async getProjectById(id: string): Promise<ProjectResource> {
        let project = await Project.findById(id).exec();
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        return this.getProjectAsProjectResource(project);
    }

    public static async createProject(project: ProjectResource): Promise<ProjectResource> {
        let user = await User.findById(project.owner).exec();
        if (!user) {
            throw new Error(`User with ID ${project.owner} not found`);
        }
        const newProject: any = new Project({
            owner: new Types.ObjectId(project.owner),
            name: project.name,
            description: project.description,
            startAt: project.startAt,
            endsAt: project.endsAt,
            public: project.public,
            githublink: project.githublink,
            closed: project.closed
        });
        const existingProject = await Project.findOne({ owner: newProject.owner, name: newProject.name }).exec()
        if (existingProject) {
            throw new Error("The Step already exists.");
        }
        const savedProject: any = await newProject.save();
        return this.getProjectAsProjectResource(savedProject);
    }

    public static async updateProject(project: ProjectResource): Promise<ProjectResource> {
        let user = await User.findById(project.owner).exec();
        const existingProject = await Project.findById(project.id).exec();
        if (!existingProject) {
            throw new Error("The Project does not exist");
        }
        if (!user) {
            throw new Error(`User with ID ${project.owner} not found`);
        }
        const updatedProject: any = await Project.findByIdAndUpdate(
            project.id,
            {
                name: project.name,
                description: project.description,
                startAt: project.startAt,
                endsAt: project.endsAt,
                public: project.public,
                closed: project.closed,
                githublink: project.githublink,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedProject) {
            throw new Error("An Error occurs when updating");
        }
        return this.getProjectAsProjectResource(updatedProject);
    }

    public static async deleteProject(id: string): Promise<void> {
        const project = await Project.findByIdAndDelete(id).exec();
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        // delete all card in the step
        //await Card.deleteMany({ inStep: step..toString() }).exec();
    }

    public static getProjectAsProjectResource(data: any): ProjectResource {
        const resource: ProjectResource = {
            id: data.id,
            owner: data.owner.toString(),
            name: data.name,
            description: data.description,
            startAt: data.startAt,
            endsAt: data.endsAt,
            public: data.public,
            closed: data.closed,
            githublink: data.githublink,
            updatedAt: data.updatedAt
        }
        return resource;
    }
}