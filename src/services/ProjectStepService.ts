import { ProjectStep } from "../models/ProjectStepModel";
import { Step } from "../models/StepModel";
import { Project } from "../models/ProjectModel";
import { StepResource } from "../resources/";
import { Types } from "mongoose";
import StepService from "./StepService";


export default class ProjectStepService {
    public static async getAllStepsInProject(projectId: string): Promise<StepResource[]> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        const projectSteps = await ProjectStep.find({
            projectId: projectId
        }).exec();
        const stepResponse: StepResource[] = [];
        for (const pStep of projectSteps) {
            const step = await StepService.getStepById(pStep.id!);
            stepResponse.push(step);
        }
        return stepResponse;
    }

    public static async addStepToProject(projectId: string, stepId: string): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let step = await Step.find({ id: new Types.ObjectId(stepId) }).exec();
        if (!step) {
            throw new Error(`Step with ID ${stepId} not found`);
        }

        const existingProjectStep = await ProjectStep.find({
            projectId: new Types.ObjectId(projectId),
            stepId: new Types.ObjectId(stepId)
        }).exec();
        if (existingProjectStep) {
            throw new Error("The Step is already in the project.");
        }
        const projectStep= await ProjectStep.find({
            projectId: new Types.ObjectId(projectId)
        }).exec();
        const pStep = await ProjectStep.find({
            projectId: new Types.ObjectId(projectId),
            stepId: new Types.ObjectId(stepId),
            position: projectStep.length + 1
        }).exec();
    }

    public static async removeStepFromProject(projectId: string, stepId: string): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let step = await Step.find({ id: new Types.ObjectId(stepId) }).exec();
        if (!step) {
            throw new Error(`Step with ID ${stepId} not found`);
        }

        const projectStep = await ProjectStep.findByIdAndDelete({
            projectId: new Types.ObjectId(projectId),
            stepId: new Types.ObjectId(stepId)
        }).exec();
        if (!projectStep) {
            throw new Error("The Step is already in the project.");
        }
    }

    public static async updatePositionOfStepInProject(projectId: string, stepId: string, newPos: number): Promise<void> {
        let project = await Project.find({ id: new Types.ObjectId(projectId) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        let step = await Step.find({ id: new Types.ObjectId(stepId) }).exec();
        if (!step) {
            throw new Error(`Step with ID ${stepId} not found`);
        }

        const projectStep = await ProjectStep.findOne({
            projectId: new Types.ObjectId(projectId),
            stepId: new Types.ObjectId(stepId)
        }).exec();
        if (!projectStep) {
            throw new Error("The Step is not yet in the project.");
        }
        const newProjectStep = new ProjectStep({
            projectId: new Types.ObjectId(projectId),
            stepId: new Types.ObjectId(stepId),
            position: newPos
        });
        try {
            await newProjectStep.save();
        } catch (e) {
            throw new Error("An Error occurs.");
        }
    }
}