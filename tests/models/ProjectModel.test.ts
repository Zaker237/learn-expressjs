import { Project } from "../../src/models/ProjectModel";
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
    await project.save();
    let result: any = await Project.findOne({ name: "Project1" });
    expect(result).toBeInstanceOf(Project);
    expect(result.name).toBe(project.name);
});


test('without name', async () => {
    let user1 = {
        username: "username", firstname: "firstname", lastname: "lastname",
        email: "test@email.test", googleId: "googleId"
    }
    const userDb = new User(user1);
    await userDb.save();
    let user: any = await User.findOne({ username: "username", firstname: "firstname" });
    let project1 = {
        owner: user._id,
        description: "description3",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    try{
        const project = new Project(project1);
        await project.save();
    }catch(e){

    }
    let result: any = await Project.findOne({ createdBy: user._id });
    expect(result).toBeFalsy();
});

test('without user', async () => {
    let user1 = {
        firstname: "firstname", lastname: "lastname",
        email: "test@email.test", googleId: "googleId"
    }
    const userDb = new User(user1);
    try{
        await userDb.save();
    } catch(e){

    }
    let user: any = await User.findOne({ username: "username", firstname: "firstname" });
    let project1 = {
        name: "Project3",
        description: "description3",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    try {
        const project = new Project(project1);
        await project.save();
    } catch (error) {

    }
    let result: any = await Project.findOne({ name: "Project3" });
    expect(result).toBeFalsy();
});