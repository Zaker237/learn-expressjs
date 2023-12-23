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
});


test('getAllCards should get all card', async () => {
    for(let i=1; i <= 6; i++){
        await CardService.createCard({
            createdBy: idUser,
            asignTo: idUser,
            belongTo: idProject,
            inStep: idStep,
            title: `Card${i}`,
            description: "description"
        });
    }
    const result = await CardService.getAllCards();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(6);
});


test('should get Card by id', async () => {
    const card = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: "Card1",
        description: "description"
    });
    const result = await CardService.getCardById(card.id!);
    expect(result.title).toEqual(card.title);
    expect(result.description).toEqual(card.description);
});


test('should not get Card by id: bad id', async () => {
    expect(async () => await CardService.getCardById("invaldid-card-id")).rejects;
});


test('getCardsCreatedByUser should get all card created by a user', async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 50; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CardService.createCard({
                createdBy: currentNumber === 0 ?  idUser : "invalid-user-id",
                asignTo: idUser,
                belongTo: idProject,
                inStep: idStep,
                title: "Card1",
                description: "description"
            });
        } catch (error) {

        }
    }
    const result = await CardService.getCardsCreatedByUser(idUser);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(numOfTrue);
});


test('getCardsCreatedByUser: bad id', async () => {
    expect(async () => await CardService.getCardsCreatedByUser("invaldid-user-id")).rejects;
});


test('getCardsByProjectId should get all card created in Project', async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 50; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CardService.createCard({
                createdBy: idUser,
                asignTo: idUser,
                belongTo: currentNumber === 0 ?  idProject : "invalid-project-id",
                inStep: idStep,
                title: `Card${i}`,
                description: "description"
            });
        } catch (error) {

        }
    }
    const result = await CardService.getCardsByProjectId(idProject);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(numOfTrue);
});


test('getCardsByProjectId: bad project id', async () => {
    expect(async () => await CardService.getCardsByProjectId("invaldid-project-id")).rejects;
});


test('getCardsByProjectIdAndStepId should get all card created in Project', async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 70; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (4 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CardService.createCard({
                createdBy: idUser,
                asignTo: idUser,
                belongTo: currentNumber === 0 ?  idProject : "invalid-project-id",
                inStep: currentNumber === 0 ?  idStep : "invalid-step-id",
                title: `Card${i}`,
                description: "description"
            });
        } catch (error) {

        }
    }
    const result = await CardService.getCardsByProjectIdAndStepId(idProject, idStep);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(numOfTrue);
});


test('getCardsByProjectIdAndStepId: bad project id', async () => {
    expect(async () => await CardService.getCardsByProjectIdAndStepId("invaldid-project-id", idStep)).rejects;
});


test('getCardsByProjectIdAndStepId: bad step id', async () => {
    expect(async () => await CardService.getCardsByProjectIdAndStepId(idProject, "invaldid-step-id")).rejects;
});


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


test('should not delete card: bad Id', async () => {
    expect(async () => await CardService.deleteCard("invalid card id")).rejects.toThrow(Error);
});