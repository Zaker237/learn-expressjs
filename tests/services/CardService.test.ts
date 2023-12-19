// @ts-nocxheck
import supertest from "supertest";
import {CardResource} from "../../src/resources";
import UserService from "../../src/services/UserService";
import CardService from "../../src/services/CardService";
import ProjectService from "../../src/services/ProjectService";
import StepService from "../../src/services/StepService";


let idUser: string;
let idStep: string;
let idProject: string;

beforeEach(async () => {
    // create a user
    const user = await UserService.createUser({
        username: `username`,
        firstname: `firstname`,
        lastname: `lastname`,
        email: `test@email.test`,
        googleId: `googleId`,
        admin: true
    })
    idUser = user.id!;
    // create project
    const project= await ProjectService.createProject({
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    });
    idProject = project.id!;
    // create step
    const step = await StepService.createStep({
        createdBy: user.id!,
        name: "step1",
        description: "description"
    });
    idStep = step.id!;
})


test('should create a new Card', async () => {
    const card1: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card1",
        description: "description"
    };
    const result = await CardService.createCard(card1);
    expect(result.title).toEqual(card1.title);
});


test('should not create a new Card: bad creater id', async () => {
    const card2: CardResource = {
        createdBy: "invalid-userId",
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card2",
        description: "description2"
    };
    expect(async () => await CardService.createCard(card2)).rejects;
});


test('should not create a new Card: bad creater assignTo id', async () => {
    const card3: CardResource = {
        createdBy: idUser,
        asignTo: "this-id-does-not-exists",
        belongTo: idProject,
        inStep: idStep,
        title: "Card3",
        description: "description3"
    };
    expect(async () => await CardService.createCard(card3)).rejects;
});

test('should not create a new Card: bad step id id', async () => {
    const card4: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: "this-is-an-bad-step-id",
        title: "Card4",
        description: "description4"
    };
    expect(async () => await CardService.createCard(card4)).rejects;
});


test('should update the card', async () => {
    const card5: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card5",
        description: "description5"
    };
    const result = await CardService.createCard(card5);
    expect(result.title).toEqual(card5.title);
    result.title = "updated-title";
    result.description = "updated-description";
    const updatedResult = await CardService.updateCard(result);
    expect(updatedResult.title).toEqual("updated-title");
    expect(updatedResult.description).toEqual("updated-description");
});


test('should not update bad id', async () => {
    const card6: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card6",
        description: "description6"
    };
    const result = await CardService.createCard(card6);
    expect(result.title).toEqual(card6.title);
    result.title = "updated-title";
    result.description = "updated-description";
    result.id = "this-id-does-not-exist";
    expect(async () => await CardService.updateCard(result)).rejects;
});


test('should create a step with same name', async () => {
    const card7: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card7",
        description: "description7"
    };
    const result = await CardService.createCard(card7);
    expect(async () => await CardService.createCard(card7)).rejects;
});


test('should delete Step', async () => {
    const card8: CardResource = {
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card8",
        description: "description8"
    };
    const result = await CardService.createCard(card8);
    expect(result.title).toEqual(card8.title);
    expect(async () => await CardService.deleteCard(result.id!)).resolves;
});


test('should not delete Project: bad Id', async () => {
    expect(async () => await CardService.deleteCard("this-id-does-not-exist")).resolves;
});