// @ts-nocxheck
import supertest from "supertest";
import UserService from "../../src/services/UserService";
import ProjectService from "../../src/services/ProjectService";
import ProjectMemberService from "../../src/services/ProjectMemberService"; 

let idUser: string;
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
        name: "Project",
        description: "description",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    });
    idProject = project.id!;
});


test("addMemberToProject work properly", async () => {
    expect(
        async () => await ProjectMemberService.addMemberToProject(
            idProject,
            idUser
        )
    ).resolves;
});


test("addMemberToProject bad project id", async () => {
    expect(
        async () => await ProjectMemberService.addMemberToProject(
            "invalid-project-id",
            idUser
        )
    ).rejects;
});


test("addMemberToProject bad user id", async () => {
    expect(
        async () => await ProjectMemberService.addMemberToProject(
            idProject,
            "invalid-user-id"
        )
    ).rejects;
});


test("addStepToProject add same: should not work", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.addMemberToProject(
            idProject,
            idUser,
            true
        )
    ).rejects;
});


test("getAllMembersInProject get alle", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    const response = await ProjectMemberService.getAllMembersInProject(idProject);
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(1);
});


test("removeMemberFromProject should work", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.removeMemberFromProject(
            idProject,
            idUser
        )
    ).resolves;
});


test("removeMemberFromProject non existant", async () => {
    expect(
        async () => await ProjectMemberService.removeMemberFromProject(
            idProject,
            idUser
        )
    ).rejects;
});


test("removeMemberFromProject bad project id", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.removeMemberFromProject(
            "invalid-project-id",
            idUser
        )
    ).rejects;
});


test("removeMemberFromProject bad user id", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.removeMemberFromProject(
            idProject,
            "invalid-user-id"
        )
    ).rejects;
});


test("updateMemberInProject should work", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    const user2 = await UserService.createUser({
        username: `username2`,
        firstname: `firstname2`,
        lastname: `lastname2`,
        email: `test2@email.test`,
        googleId: `googleId2`,
        admin: false
    })
    await ProjectMemberService.addMemberToProject(idProject, user2.id!);
    expect(
        async () => await ProjectMemberService.updateMemberInProject(
            idProject,
            user2.id!,
            true
        )
    ).resolves;
});


test("updateMemberInProject non existing", async () => {
    expect(
        async () => await ProjectMemberService.updateMemberInProject(
            idProject,
            idUser
        )
    ).rejects;
});


test("updateMemberInProject bad project id", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.updateMemberInProject(
            "invalid project id",
            idUser
        )
    ).rejects;
});


test("updateMemberInProject bad step id", async () => {
    await ProjectMemberService.addMemberToProject(idProject, idUser);
    expect(
        async () => await ProjectMemberService.updateMemberInProject(
            idProject,
            "invalid user id"
        )
    ).rejects;
});