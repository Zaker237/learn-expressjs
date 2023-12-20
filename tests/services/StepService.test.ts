import {StepResource} from "../../src/resources";
import UserService from "../../src/services/UserService";
import StepService from "../../src/services/StepService";

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


test("getAllSteps get alle", async () => {
    for (let i = 1; i <= 6; i++) {
        await StepService.createStep({
            createdBy: idUser,
            name: `step${i}`,
            description: `description${i}`
        });
    }
    const response = await StepService.getAllSteps();
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(6);
});


test("getStepsCreatedByUser get alle", async () => {
    for (let i = 1; i <= 10; i++) {
        await StepService.createStep({
            createdBy: idUser,
            name: `step${i}`,
            description: `description${i}`
        });
    }
    const response = await StepService.getStepsCreatedByUser(idUser);
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(10);
});


test('should not create a new Step', async () => {
    const step1: StepResource = {
        createdBy: "this-string-is-not-an-id",
        name: "step1",
        description: "description"
    };
    expect(async () => await StepService.createStep(step1)).rejects;
});


test('should create a new Step', async () => {
    const step2: StepResource = {
        createdBy: idUser,
        name: "step2",
        description: "description"
    };
    const result = await StepService.createStep(step2);
    expect(result.name).toEqual(step2.name);
});


test('should get a Step by its id', async () => {
    const step2: StepResource = {
        createdBy: idUser,
        name: "step2",
        description: "description"
    };
    const result = await StepService.createStep(step2);
    const step = await StepService.getStepById(result.id!);
    expect(result.name).toEqual(step2.name);
    expect(step.name).toEqual(result.name);
    expect(step.name).toEqual(step2.name);
});


test('should not get Step by id: bad id', async () => {
    expect(async () => await StepService.getStepById("invaldid-id")).rejects;
});


test('should create a step with same name', async () => {
    const step3: StepResource = {
        createdBy: idUser,
        name: "step3",
        description: "description"
    };
    const result = await StepService.createStep(step3);
    expect(async () => await StepService.createStep(step3)).rejects;
});


test('should delete Step', async () => {
    const step4: StepResource = {
        createdBy: idUser,
        name: "step4",
        description: "description"
    };
    const result = await StepService.createStep(step4);
    expect(result.name).toEqual(step4.name);
    expect(async () => await StepService.deleteStep(result.id!)).resolves;
});


test('should not delete Step: bad Id', async () => {
    expect(async () => await StepService.deleteStep("this-id-does-not-exist")).resolves;
});