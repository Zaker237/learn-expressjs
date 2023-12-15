import {StepResource} from "../../src/resources";
import {User} from "../../src/models/UserModel";
import {Step} from "../../src/models/StepModel";
import UserService from "../../src/services/UserService";
import StepService from "../../src/services/StepService";

const user1 = {
    username: "username1", firstname: "firstname1", lastname: "lastname1",
    email: "test1@email.test", googleId: "googleId"
};


test('should not create a new Step', async () => {
    const step1: StepResource = {
        createdBy: "this-string-is-not-an-id",
        name: "step1",
        description: "description"
    };
    expect(async () => await StepService.createStep(step1)).rejects;
});


test('should create a new Step', async () => {
    const user = await UserService.createUser(user1);
    const step2: StepResource = {
        createdBy: user.id!,
        name: "step2",
        description: "description"
    };
    const result = await StepService.createStep(step2);
    expect(result.name).toEqual(step2.name);
});


test('should create a step with same name', async () => {
    const user = await UserService.createUser(user1);
    const step3: StepResource = {
        createdBy: user.id!,
        name: "step3",
        description: "description"
    };
    const result = await StepService.createStep(step3);
    expect(async () => await StepService.createStep(step3)).rejects;
});


test('should delete Step', async () => {
    const user = await UserService.createUser(user1);
    const step4: StepResource = {
        createdBy: user.id!,
        name: "step4",
        description: "description"
    };
    const result = await StepService.createStep(step4);
    expect(result.name).toEqual(step4.name);
    expect(async () => await StepService.deleteStep(result.id!)).resolves;
});