import { Step } from "../../src/models/StepModel";
import { User } from "../../src/models/UserModel";
import mongoose from "mongoose";

test('Genereller Test', async () => {
    let user1 = {
        username: "username", firstname: "firstname", lastname: "lastname",
        email: "test@email.test", googleId: "googleId"
    }
    const userDb = new User(user1);
    await userDb.save();
    let user: any = await User.findOne({ username: "username", firstname: "firstname" });
    let step1 = { createdBy: user._id, name: "Backlog1", description: "description"};
    const step = new Step(step1);
    await step.save();
    let result: any = await Step.findOne({ name: "Backlog1" });
    expect(result).toBeInstanceOf(Step);
    expect(result.name).toBe(step.name);
});

test('without name', async () => {
    let user1 = {
        username: "username", firstname: "firstname", lastname: "lastname",
        email: "test@email.test", googleId: "googleId"
    }
    const userDb = new User(user1);
    await userDb.save();
    let user: any = await User.findOne({ username: "username", firstname: "firstname" });
    let step1 = { createdBy: user._id, description: "description"};
    const step = new Step(step1);
    await step.save();
    let result: any = await Step.findOne({ createdBy: user._id });
    expect(result.name).toBeFalsy();
});

test('without user', async () => {
    let user1 = {
        firstname: "firstname", lastname: "lastname",
        email: "test@email.test", googleId: "googleId"
    }
    const userDb = new User(user1);
    await userDb.save();
    let user: any = await User.findOne({ username: "username", firstname: "firstname" });
    let step1 = { createdBy: user._id, name: "Backlog2", description: "description"};
    const step = new Step(step1);
    await step.save();
    let result: any = await Step.findOne({ name: "Backlog3" });
    expect(result.name).toBeFalsy();
});