import { Card } from "../models/CardModel";
import { CardResource } from "../resources/";
import { Types } from "mongoose";
import { User } from "../models/UserModel";
import { Project } from "../models/ProjectModel";
import { Step } from "../models/StepModel";


export default class CardService {
    public static async getAllCards(): Promise<CardResource[]> {
        const cards = await Card.find().exec();
        const cardResponse: CardResource[] = [];
        for (const card of cards) {
            const resource = this.getCardAsCardResource(card);
            cardResponse.push(resource);
        }
        return cardResponse;
    }

    public static async getCardsCreatedByUser(userId: string): Promise<CardResource[]> {
        let user = await User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const cards = await Card.find({
            createdBy: new Types.ObjectId(userId)
        }).exec();

        const cardResponse: CardResource[] = [];
        for (const card of cards) {
            const resource = this.getCardAsCardResource(card);
            cardResponse.push(resource)
        }
        return cardResponse;
    }

    public static async getCardsByProjectId(projectId: string): Promise<CardResource[]> {
        let project = await Project.findById(projectId).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        const cards = await Card.find({
            belongTo: new Types.ObjectId(projectId)
        }).exec();

        const cardResponse: CardResource[] = [];
        for (const card of cards) {
            const resource = this.getCardAsCardResource(card);
            cardResponse.push(resource)
        }
        return cardResponse;
    }

    public static async getCardsByProjectIdAndStepId(projectId: string, stepId: string): Promise<CardResource[]> {
        let project = await Project.findById(projectId).exec();
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        let step = await Step.findById(stepId).exec();
        if (!step) {
            throw new Error(`Step with ID ${stepId} not found`);
        }
        const cards = await Card.find({
            belongTo: new Types.ObjectId(projectId),
            inStep: new Types.ObjectId(stepId),
        }).exec();

        const cardResponse: CardResource[] = [];
        for (const card of cards) {
            const resource = this.getCardAsCardResource(card);
            cardResponse.push(resource)
        }
        return cardResponse;
    }

    public static async getCardById(id: string): Promise<CardResource> {
        let card = await Card.findById(id).exec();
        if (!card) {
            throw new Error(`Card with ID ${id} not found`);
        }
        return this.getCardAsCardResource(card);
    }

    public static async createCard(card: CardResource): Promise<CardResource> {
        let user = await User.findById(card.createdBy).exec();
        if (!user) {
            throw new Error(`User with ID ${card.createdBy} not found`);
        }
        let member = await User.findById(card.asignTo).exec();
        if (!member) {
            throw new Error(`Member with ID ${card.asignTo} not found`);
        }
        let project = await Project.findById(card.belongTo).exec();
        if (!project) {
            throw new Error(`Project with ID ${card.createdBy} not found`);
        }
        let step = await Step.findById(card.inStep).exec();
        if (!step) {
            throw new Error(`Step with ID ${card.createdBy} not found`);
        }
        const newCard: any = new Card({
            createdBy: card.createdBy.toString(),
            asignTo: card.asignTo.toString(),
            belongTo: card.belongTo.toString(),
            inStep: card.inStep.toString(),
            title: card.title,
            description: card.description
        });
        const existingCard = await Card.findOne({
            createdBy: newCard.createdBy,
            belongTo: newCard.belongTo,
            inStep: newCard.inStep,
            title: newCard.title
        }).exec()
        if (existingCard) {
            throw new Error("The Step already exists.");
        }
        const savedCard: any = await newCard.save();
        return this.getCardAsCardResource(savedCard);
    }

    public static async updateCard(card: CardResource): Promise<CardResource> {
        let user = await User.findById(card.createdBy).exec();
        if (!user) {
            throw new Error(`User with ID ${card.createdBy} not found`);
        }
        let member = await User.findById(card.asignTo).exec();
        if (!member) {
            throw new Error(`Member with ID ${card.createdBy} not found`);
        }
        let project = await Project.findById(card.belongTo).exec();
        if (!project) {
            throw new Error(`Project with ID ${card.createdBy} not found`);
        }
        let step = await Step.findById(card.inStep).exec();
        if (!step) {
            throw new Error(`Step with ID ${card.createdBy} not found`);
        }
        const existingCard = await Card.findById(card.id).exec();
        if (!existingCard) {
            throw new Error("The Card does not exist");
        }
        const updatedCard: any = await Card.findByIdAndUpdate(
            card.id,
            {
                createdBy: card.createdBy.toString(),
                asignTo: card.asignTo.toString(),
                belongTo: card.belongTo.toString(),
                inStep: card.inStep.toString(),
                title: card.title,
                description: card.description
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedCard) {
            throw new Error("An Error occurs when updating");
        }
        return this.getCardAsCardResource(updatedCard);
    }

    public static async deleteCard(id: string): Promise<void> {
        try {
            const card = await Card.findByIdAndDelete(id).exec();
            if (!card) {
                throw new Error(`Card with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error("Card could not be deleted.")
        }
    }

    public static getCardAsCardResource(data: any): CardResource {
        const resource: CardResource = {
            id: data.id,
            createdBy: data.createdBy.toString(),
            asignTo: data.asignTo.toString(),
            belongTo: data.belongTo.toString(),
            inStep: data.inStep.toString(),
            title: data.title,
            description: data.description
        }
        return resource;
    }
}