import { ICard, Card } from "../models/CardModel";
import { CardResource } from "../resources/";
import mongoose, { Types } from "mongoose";
// import { dateToString, stringToDate } from "./ServiceHelper";
// import { ExceptionHandler } from "winston";
import { User } from "../models/UserModel";
import { Project } from "../models/ProjectModel";
import { Step } from "../models/StepModel";


export default class CardService {
    public static async getAllCards(): Promise<CardResource[]> {
        const Cards = await Card.find().exec();
        const CardResponse: CardResource[] = [];
        for (const Card of Cards) {
            const resource = this.getCardAsCardResource(Card);
            CardResponse.push(resource);
        }
        return CardResponse;
    }

    public static async getCardsCreatedByUser(userId: string): Promise<CardResource[]> {
        let user = await User.find({ id: new Types.ObjectId(userId) }).exec();
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const Cards = await Card.find({
            owner: new Types.ObjectId(userId)
        }).exec();

        const CardResponse: CardResource[] = [];
        for (const Card of Cards) {
            const resource = this.getCardAsCardResource(Card);
            CardResponse.push(resource)
        }
        return CardResponse;
    }

    public static async getCardById(id: string): Promise<CardResource> {
        let card = await Card.find({ id: new Types.ObjectId(id) }).exec();
        if (!card) {
            throw new Error(`Card with ID ${id} not found`);
        }
        return this.getCardAsCardResource(card);
    }

    public static async createCard(card: CardResource): Promise<CardResource> {
        let user = await User.find({ id: new Types.ObjectId(card.createdBy) }).exec();
        if (!user) {
            throw new Error(`User with ID ${card.createdBy} not found`);
        }
        let member = await User.find({ id: new Types.ObjectId(card.asignTo) }).exec();
        if (!member) {
            throw new Error(`Member with ID ${card.createdBy} not found`);
        }
        let project = await Project.find({ id: new Types.ObjectId(card.belongTo) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${card.createdBy} not found`);
        }
        let step = await Step.find({ id: new Types.ObjectId(card.inStep) }).exec();
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
        let user = await User.find({ id: new Types.ObjectId(card.createdBy) }).exec();
        if (!user) {
            throw new Error(`User with ID ${card.createdBy} not found`);
        }
        let member = await User.find({ id: new Types.ObjectId(card.asignTo) }).exec();
        if (!member) {
            throw new Error(`Member with ID ${card.createdBy} not found`);
        }
        let project = await Project.find({ id: new Types.ObjectId(card.belongTo) }).exec();
        if (!project) {
            throw new Error(`Project with ID ${card.createdBy} not found`);
        }
        let step = await Step.find({ id: new Types.ObjectId(card.inStep) }).exec();
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