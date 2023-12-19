import { Step } from "../models/StepModel";
import { StepResource } from "../resources/";
import { Types } from "mongoose";
import { User } from "../models/UserModel";
import { Project } from "../models/ProjectModel";
import ProjectStepService from "./ProjectStepService";


export default class StepService {
    public static async getAllSteps(): Promise<StepResource[]> {
        const steps = await Step.find().exec();
        const stepResponse: StepResource[] = [];
        for (const step of steps) {
            const resource = this.getStepAsStepResource(step);
            stepResponse.push(resource);
        }
        return stepResponse;
    }

    public static async getStepsCreatedByUser(userId: string): Promise<StepResource[]> {
        let user = await User.find({ id: new Types.ObjectId(userId) }).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const steps = await Step.find({
            createdBy: new Types.ObjectId(userId)
        }).exec();

        const stepResponse: StepResource[] = [];
        for (const step of steps) {
            const resource = this.getStepAsStepResource(step);
            stepResponse.push(resource)
        }

        return stepResponse;
    }

    public static async getStepsCreatedByProject(projectId: string): Promise<StepResource[]> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`User with ID ${projectId} not found`);
        }

        const steps = await ProjectStepService.getAllStepsInProject(projectId);

        const stepResponse: StepResource[] = [];
        for (const step of steps) {
            const resource = this.getStepAsStepResource(step);
            stepResponse.push(resource)
        }

        return stepResponse;
    }

    public static async getStepById(stepId: string): Promise<StepResource> {
        let step = await Step.findById(stepId).exec();
        if (!step) {
            throw new Error(`Step with ID ${stepId} not found`);
        }
        return this.getStepAsStepResource(step);
    }

    public static async createStep(step: StepResource): Promise<StepResource> {
        let user = await User.findById(step.createdBy).exec();
        if (!user) {
            throw new Error(`User with ID ${step.createdBy} not found`);
        }
        const newStep: any = new Step({
            createdBy: new Types.ObjectId(step.createdBy),
            name: step.name,
            description: step.description
        });
        const existingStep = await Step.findOne({ createdBy: newStep.createdBy, name: newStep.name }).exec()
        if (existingStep) {
            throw new Error("The Step already exists.");
        }
        const savedStep: any = await newStep.save();
        return this.getStepAsStepResource(savedStep);
    }

    public static async updateStep(step: StepResource): Promise<StepResource> {
        let user = await User.findById(step.createdBy).exec();
        const existingStep = await Step.findById(step.id).exec();
        if (!existingStep) {
            throw new Error("The step does not exist");
        }
        if (!user) {
            throw new Error(`User with ID ${step.createdBy} not found`);
        }
        const updatedStep: any = await Step.findByIdAndUpdate(
            step.id,
            {
                name: step.name,
                description: step.description
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedStep) {
            throw new Error("An Error occurs when updating");
        }
        return this.getStepAsStepResource(updatedStep);
    }

    public static async deleteStep(id: string): Promise<void> {
        try {
            const step = await Step.findByIdAndDelete(id).exec();
            if (!step) {
                throw new Error(`Step with ID ${id} not found`);
            }
            // delete all card in the step
            //await Card.deleteMany({ inStep: step..toString() }).exec();
        } catch (error) {
            throw new Error("Step could not be deleted.")
        }
    }

    public static getStepAsStepResource(step: any): StepResource {
        const resource: StepResource = {
            id: step.id,
            createdBy: step.createdBy.toString(),
            name: step.name,
            description: step.description
        }
        return resource;
    }
}