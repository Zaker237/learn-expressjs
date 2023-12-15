import {StepResource} from "../../src/resources";
import {User} from "../../src/models/UserModel";
import {Step} from "../../src/models/StepModel";
import UserService from "../../src/services/UserService";
import StepService from "../../src/services/StepService";

const user1 = {
    username: "username1", firstname: "firstname1", lastname: "lastname1",
    email: "test1@email.test", googleId: "googleId"
};

test('should create a new Step', async () => {
    const user = await UserService.createUser(user1);
    const step1: StepResource = {
        createdBy: user.id!,
        name: "step1",
        description: "description"
    };
    const result = await StepService.createStep(step1);
    expect(result.name).toEqual(step1.name);
});