// @ts-nocxheck
import supertest from "supertest";
import app from "../../src/app";
import UserService from "../../src/services/UserService";
import StepService from "../../src/services/StepService";
import {request} from "http";

let idUser: string

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
})


test("/api/v0/steps/ get alle, 7 stes", async () => {
    for (let i = 1; i <= 7; i++) {
        await StepService.createStep({
            createdBy: idUser!,
            name: `name${i}`,
            description:  `description${i}`
        })
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/steps/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(7);
});


test("/api/v0/steps/user/:userId get alle, 5 Users", async () => {
    for (let i = 1; i <= 5; i++) {
        await StepService.createStep({
            createdBy: idUser!,
            name: `name${i}`,
            description:  `description${i}`
        })
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/steps/user/${idUser}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
});


test("/api/v0/steps/user/:userId get alle, badId", async () => {
    for (let i = 1; i <= 5; i++) {
        await StepService.createStep({
            createdBy: idUser!,
            name: `name${i}`,
            description:  `description${i}`
        })
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/steps/user/bad-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/steps/:id get step by id", async () => {
    var newStep = await StepService.createStep({
        createdBy: idUser,
        name: "name22",
        description: "description22",
    })
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/steps/${newStep.id!}`);
    const allSteps = await StepService.getAllSteps()
    expect(response.statusCode).toBe(200);
    expect(allSteps.length).toBe(1);
});


test("/api/v0/steps/:id get badId", async () => {
    await StepService.createStep({
        createdBy: idUser,
        name: "name3",
        description: "description3",
    })
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/steps/id-does-not-exists`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/steps/:id delete step by id", async () => {
    var newStep = await StepService.createStep({
        createdBy: idUser,
        name: "name4",
        description: "description4",
    })
    const testee = supertest(app);
    const steps = await StepService.getAllSteps()
    expect(steps.length).toBe(1);
    const response = await testee.delete(`/api/v0/steps/${newStep.id}`);
    const allSteps = await StepService.getAllSteps()
    expect(response.statusCode).toBe(200);
    expect(allSteps.length).toBe(0);
});


test("/api/v0/steps/:id delete step by badId", async () => {
    await StepService.createStep({
        createdBy: idUser,
        name: "name4",
        description: "description4",
    })
    const testee = supertest(app);
    const steps = await StepService.getAllSteps()
    expect(steps.length).toBe(1);
    const response = await testee.delete(`/api/v0/steps/jdbjk-ifjkbfd`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/steps/ add step", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/steps/`).send({
        createdBy: idUser,
        name: "name5",
        description: "description5",
    })
    const allStep = await StepService.getAllSteps();
    expect(response.statusCode).toBe(200);
    expect(allStep.length).toBe(1);
});


test("/api/v0/steps/ add step bad user ID", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/steps/`).send({
        createdBy: "jhdvblksfjd",
        name: "name6",
        description: "description6",
    })
    expect(response.statusCode).toBe(404);
});


test("/api/v0/steps/ add step with an existing name", async () => {
    const testee = supertest(app);
    await testee.post(`/api/v0/steps/`).send({
        createdBy: idUser,
        name: "name5",
        description: "description5",
    })

    const response = await testee.post(`/api/v0/steps/`).send({
        createdBy: idUser,
        name: "name5",
        description: "description555555",
    })
    expect(response.statusCode).toBe(404);
});


test("/api/v0/steps/:id update user", async () => {
    var newStep = await StepService.createStep({
        createdBy: idUser,
        name: "name6",
        description: "description6",
    })
    const testee = supertest(app);
    const response = await testee.put(`/api/v0/steps/${newStep.id}`).send({
        id: newStep.id!,
        createdBy: idUser,
        name: "name66",
        description: "description6",
    })
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe("name66");
});