// @ts-nocxheck
import supertest from "supertest";
import app from "../../src/app";
import UserService from "../../src/services/UserService";
import CardService from "../../src/services/CardService";
import StepService from "../../src/services/StepService";
import ProjectService from "../../src/services/ProjectService";

let idUser: string
let idProject: string
let idStep: string

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
        name: "Project",
        description: "description",
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
        name: "step",
        description: "description"
    });
    idStep = step.id!;
})


test("/api/v0/cards/ get alle, 6 cards", async () => {
    for (let i = 1; i <= 6; i++) {
        await CardService.createCard({
            createdBy: idUser,
            asignTo: idUser,
            belongTo: idProject,
            inStep: idStep,
            title: `Card${i}`,
            description: `description${i}`
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(6);
});


test("/api/v0/cards/user/:userId get alle user card, 5 Card", async () => {
    for (let i = 1; i <= 5; i++) {
        await CardService.createCard({
            createdBy: idUser,
            asignTo: idUser,
            belongTo: idProject,
            inStep: idStep,
            title: `Card${i}`,
            description: `description${i}`
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/user/${idUser}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
});


test("/api/v0/cards/project/:projectId get alle project card, 8 Users", async () => {
    for (let i = 1; i <= 8; i++) {
        await CardService.createCard({
            createdBy: idUser,
            asignTo: idUser,
            belongTo: idProject,
            inStep: idStep,
            title: `Card${i}`,
            description: `description${i}`
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/project/${idProject}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(8);
});


test("/api/v0/cards/project/:projectId get alle, project Id", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/project/invalid-project-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/user/:userId get alle, badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/user/bad-user-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/:id get card by id", async () => {
    const newCard = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card1`,
        description: `description1`
    });
    const allCards = await CardService.getAllCards();
    expect(allCards.length).toBe(1);
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/${newCard.id!}`);
    expect(response.statusCode).toBe(200);
});


test("/api/v0/cards/:id get badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/cards/id-does-not-exists`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/:id delete card by id", async () => {
    const newCard = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card2`,
        description: `description2`
    });
    const testee = supertest(app);
    const cards = await CardService.getAllCards()
    expect(cards.length).toBe(1);
    const response = await testee.delete(`/api/v0/cards/${newCard.id}`);
    const allCards = await CardService.getAllCards()
    expect(response.statusCode).toBe(200);
    expect(allCards.length).toBe(0);
});


test("/api/v0/cards/:id delete card by badId", async () => {
    await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card2`,
        description: `description2`
    });
    const testee = supertest(app);
    const cards = await CardService.getAllCards()
    expect(cards.length).toBe(1);
    const response = await testee.delete(`/api/v0/cards/invalid-card-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/ add project", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/cards/`).send({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card3`,
        description: `description3`
    });
    const allProject = await CardService.getAllCards();
    expect(response.statusCode).toBe(200);
    expect(allProject.length).toBe(1);
});


test("/api/v0/cards/ add card bad user Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/cards/`).send({
        createdBy: "invalid-user-id",
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card4`,
        description: `description4`
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/ add card bad project Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/cards/`).send({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: "invalid-project-id",
        inStep: idStep,
        title: `Card5`,
        description: `description5`
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/ add card bad step Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/cards/`).send({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: "invalid-step-id",
        title: `Card6`,
        description: `description6`
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/cards/:id update card", async () => {
    var newCard = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `Card7`,
        description: `description7`
    });
    const testee = supertest(app);
    const response = await testee.put(`/api/v0/cards/${newCard.id!}`).send({
        id: newCard.id!,
        createdBy: idUser,
        asignTo: idUser,
        belongTo: idProject,
        inStep: idStep,
        title: `updated-card`,
        description: `description6`
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.title).toBe("updated-card");
});