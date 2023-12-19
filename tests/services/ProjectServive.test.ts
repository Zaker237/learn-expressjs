import {ProjectResource} from "../../src/resources";
import UserService from "../../src/services/UserService";
import ProjectService from "../../src/services/ProjectService";

const user1 = {
    username: "username1",
    firstname: "firstname1",
    lastname: "lastname1",
    email: "test1@email.test",
    googleId: "googleId"
};


test('should get Project by id', async () => {
    const user = await UserService.createUser(user1);
    const project1: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project1);
    const project = await ProjectService.getProjectById(result.id!);
    expect(result.name).toEqual(project.name);
    expect(project.name).toEqual(project1.name);
});


test('should not get Project by id: bad id', async () => {
    expect(async () => await ProjectService.getProjectById("invaldid-id")).rejects;
});


test('should create a new Project', async () => {
    const user = await UserService.createUser(user1);
    const project1: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project1);
    expect(result.name).toEqual(project1.name);
});


test('should not create a new Project: bad userId', async () => {
    const project2: ProjectResource = {
        owner: "this-string-is-not-an-id",
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: ""
    };
    expect(async () => await ProjectService.createProject(project2)).rejects;
});


test('should update the project', async () => {
    const user = await UserService.createUser(user1);
    const project1: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project1);
    expect(result.name).toEqual(project1.name);
    result.name = "updated-name";
    result.description = "updated-description";
    const updatedResult = await ProjectService.updateProject(result);
    expect(updatedResult.name).toEqual("updated-name");
    expect(updatedResult.description).toEqual("updated-description");
});


test('should not update bad id', async () => {
    const user = await UserService.createUser(user1);
    const project1: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project1);
    expect(result.name).toEqual(project1.name);
    result.name = "updated-name";
    result.description = "updated-description";
    result.id = "this-id-does-not-exist";
    expect(async () => await ProjectService.updateProject(result)).rejects;
});


test('should create a step with same name', async () => {
    const user = await UserService.createUser(user1);
    const project3: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project3);
    expect(async () => await ProjectService.createProject(project3)).rejects;
});


test('should delete Step', async () => {
    const user = await UserService.createUser(user1);
    const project4: ProjectResource = {
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    };
    const result = await ProjectService.createProject(project4);
    expect(result.name).toEqual(project4.name);
    expect(async () => await ProjectService.deleteProject(result.id!)).resolves;
});


test('should not delete Project: bad Id', async () => {
    expect(async () => await ProjectService.deleteProject("this-id-does-not-exist")).resolves;
});