import { Project } from "../../src/models/ProjectModel";
import { User } from "../../src/models/UserModel";
import { Card } from "../../src/models/CardModel";
import { Step } from "../../src/models/StepModel";
import { Comment } from "../../src/models/CommentModel";
import mongoose from "mongoose";

let idUser: string;
let idCard: string;

beforeEach(async () => {
    // create a user
    const user1 = {
        username: `username`,
        firstname: `firstname`,
        lastname: `lastname`,
        email: `test@email.test`,
        googleId: `googleId`,
        admin: true
    };
    const user = new User(user1);
    await user.save();
    idUser = user.id!;
    // create a step
    const step1 = {
        createdBy: idUser,
        name: `Todo`,
        description:  `description`
    };
    const step = new Step(step1);
    await step.save();
    let project1 = {
        owner: user._id,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const project = new Project(project1);
    let card1 = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: project.id!,
        inStep: step.id!,
        title: "Card1",
        description: "description"
    };
    const card = new Card(card1);
    await card.save();
    idCard = card.id!;
})


test('Genereller Test', async () => {
    let comment1 = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Text1"
    };
    const comment = new Comment(comment1);
    await comment.save();
    let result: any = await Comment.findOne({ text: "Text1" });
    expect(result).toBeInstanceOf(Comment);
    expect(result.text).toBe(comment.text);
});


test('without user', async () => {
    let comment1 = {
        belongTo: idCard,
        text: "Comment1"
    };
    try{
        const comment = new Comment(comment1);
        await comment.save();
    }catch(e){

    }
    let result: any = await Comment.findOne({ title: "Comment1" });
    expect(result).toBeFalsy();
});

test('without card', async () => {
    let comment1 = {
        createdBy: idUser,
        text: "Comment2"
    };
    try{
        const comment = new Comment(comment1);
        await comment.save();
    }catch(e){

    }
    let result: any = await Comment.findOne({ text: "Comment2" });
    expect(result).toBeFalsy();
});

test('without text', async () => {
    let comment1 = {
        createdBy: idUser,
        belongTo: idCard,
    };
    try{
        const comment = new Comment(comment1);
        await comment.save();
    }catch(e){

    }
    let result: any = await Comment.findOne({ createdBy: idUser });
    expect(result).toBeFalsy();
});