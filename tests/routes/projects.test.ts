// @ts-nocxheck
import supertest from "supertest";
import app from "../../src/app";
import UserService from "../../src/services/UserService";
import ProjectService from "../../src/services/ProjectService";

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


test("/api/v0/projects/ get alle, 10 stes", async () => {
    for (let i = 1; i <= 10; i++) {
        await ProjectService.createProject({
            owner: idUser,
            name: `Project${i}`,
            description: `description${i}`,
            startAt: new Date().toISOString(),
            endsAt: new Date().toISOString(),
            public: false,
            closed: false,
            githublink: `githublink${i}`,
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/projects/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(10);
});


test("/api/v0/projects/user/:userId get alle user project, 5 Users", async () => {
    for (let i = 1; i <= 5; i++) {
        await ProjectService.createProject({
            owner: idUser,
            name: `Project${i}`,
            description: `description${i}`,
            startAt: new Date().toISOString(),
            endsAt: new Date().toISOString(),
            public: false,
            closed: false,
            githublink: `githublink${i}`,
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/projects/user/${idUser}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
});


test("/api/v0/projects/user/:userId get alle, badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/projects/user/bad-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/projects/:id get project by id", async () => {
    const newProject = await ProjectService.createProject({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    const allProjects = await ProjectService.getAllProjects();
    expect(allProjects.length).toBe(1);
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/projects/${newProject.id!}`);
    expect(response.statusCode).toBe(200);
});


test("/api/v0/projects/:id get badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/projects/id-does-not-exists`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/projects/:id delete project by id", async () => {
    var newProject = await ProjectService.createProject({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toDateString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    const testee = supertest(app);
    const projects = await ProjectService.getAllProjects()
    expect(projects.length).toBe(1);
    const response = await testee.delete(`/api/v0/projects/${newProject.id}`);
    const allProjects = await ProjectService.getAllProjects()
    expect(response.statusCode).toBe(200);
    expect(allProjects.length).toBe(0);
});


test("/api/v0/projects/:id delete project by badId", async () => {
    await ProjectService.createProject({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    const testee = supertest(app);
    const projects = await ProjectService.getAllProjects()
    expect(projects.length).toBe(1);
    const response = await testee.delete(`/api/v0/projects/invalid-project-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/projects/ add project", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/projects/`).send({
        owner: idUser,
        name: "Project",
        description: "description",
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: "githublink",
    });
    const allProject = await ProjectService.getAllProjects();
    expect(response.statusCode).toBe(200);
    expect(allProject.length).toBe(1);
});


test("/api/v0/projects/ add project bad user Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/projects/`).send({
        owner: `invalid-user-id`,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/projects/ add project with an existing name", async () => {
    const testee = supertest(app);
    await testee.post(`/api/v0/projects/`).send({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    const response = await testee.post(`/api/v0/projects/`).send({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    })
    expect(response.statusCode).toBe(404);
});


test("/api/v0/projects/:id update project", async () => {
    var newProject = await ProjectService.createProject({
        owner: idUser,
        name: `Project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    const testee = supertest(app);
    const response = await testee.put(`/api/v0/projects/${newProject.id!}`).send({
        id: newProject.id!,
        owner: idUser,
        name: `updated-project`,
        description: `description`,
        startAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
        public: false,
        closed: false,
        githublink: `githublink`,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe("updated-project");
});