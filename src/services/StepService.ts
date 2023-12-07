import { IStep, Step } from "../models/StepModel";
import { StepResource } from "../resources/";
import mongoose, { Types } from "mongoose";
// import { dateToString, stringToDate } from "./ServiceHelper";
// import { ExceptionHandler } from "winston";
import { User } from "../models/UserModel";
// import { Card } from "../models/CardModel";


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

    public static async getStepById(id: string): Promise<StepResource> {
        let step = await Step.find({ id: new Types.ObjectId(id) }).exec();
        if (!step) {
            throw new Error(`Step with ID ${id} not found`);
        }
        return this.getStepAsStepResource(step);
    }

    public static async createStep(step: StepResource): Promise<StepResource> {
        let user = await User.find({ id: new Types.ObjectId(step.createdBy) }).exec();
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
        let user = await User.find({ id: new Types.ObjectId(step.createdBy) }).exec();
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