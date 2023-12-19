import { Project } from "../../src/models/ProjectModel";
import { User } from "../../src/models/UserModel";
import { Card } from "../../src/models/CardModel";
import { Step } from "../../src/models/StepModel";

let idUser: string;
let idProject: string;
let idStep: string;

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
    idStep = step.id!;
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
    idProject = project.id!;
})


test('Genereller Test', async () => {
    let card1 = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card1",
        description: "description"
    };
    const card = new Card(card1);
    await card.save();
    let result: any = await Card.findOne({ title: "Card1" });
    expect(result).toBeInstanceOf(Card);
    expect(result.title).toBe(card.title);
});


test('without user', async () => {
    let card1 = {
        asignTo: idProject,
        belongTo: idProject,
        inStep: idStep,
        title: "Card1",
        description: "description"
    };
    try{
        const card = new Card(card1);
        await card.save();
    }catch(e){

    }
    let result: any = await Card.findOne({ title: "Card1" });
    expect(result).toBeFalsy();
});

test('without project', async () => {
    let card1 = {
        createdBy: idUser,
        asignTo: idUser,
        inStep: idStep,
        title: "Card1",
        description: "description"
    };
    try{
        const card = new Card(card1);
        await card.save();
    }catch(e){

    }
    let result: any = await Card.findOne({ title: "Card1" });
    expect(result).toBeFalsy();
});

test('without step', async () => {
    let card1 = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        title: "Card1",
        description: "description"
    };
    try{
        const card = new Card(card1);
        await card.save();
    }catch(e){

    }
    let result: any = await Card.findOne({ title: "Card1" });
    expect(result).toBeFalsy();
});


test('without title', async () => {
    let card1 = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        description: "description"
    };
    try {
        const card = new Card(card1);
        await card.save();
    } catch (error) {

    }
    let result: any = await Card.findOne({ createdBy: idUser });
    expect(result).toBeFalsy();
});