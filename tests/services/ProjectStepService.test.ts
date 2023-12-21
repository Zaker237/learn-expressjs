import {StepResource} from "../../src/resources";
import UserService from "../../src/services/UserService";
import ProjectService from "../../src/services/ProjectService";
import ProjectStepService from "../../src/services/ProjectStepService";
import StepService from "../../src/services/StepService";

let idUser: string;
let idStep: string;
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
        name: "Project1",
        description: "description1",
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
        name: "step1",
        description: "description"
    });
    idStep = step.id!;
});


test("addStepToProject work properly", async () => {
    expect(
        async () => await ProjectStepService.addStepToProject(
            idProject,
            idStep
        )
    ).resolves;
});


test("addStepToProject bad project id", async () => {
    expect(
        async () => await ProjectStepService.addStepToProject(
            "invalid-project-id",
            idStep
        )
    ).rejects;
});


test("addStepToProject bad step id", async () => {
    expect(
        async () => await ProjectStepService.addStepToProject(
            idProject,
            "invalid-step-id"
        )
    ).rejects;
});


test("addStepToProject add same: should not work", async () => {
    await ProjectStepService.addStepToProject(
        idProject,
        idStep
    );
    expect(
        async () => await ProjectStepService.addStepToProject(
            idProject,
            idStep
        )
    ).rejects;
});


test("getAllStepsInProject get alle", async () => {
    await ProjectStepService.addStepToProject(idProject, idStep);
    const response = await ProjectStepService.getAllStepsInProject(idProject);
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBe(1);
});


test("removeStepFromProject should work", async () => {
    await ProjectStepService.addStepToProject(idProject, idStep);
    expect(
        async () => await ProjectStepService.removeStepFromProject(
            idProject,
            idStep
        )
    ).resolves;
});


test("removeStepFromProject non existant", async () => {
    expect(
        async () => await ProjectStepService.removeStepFromProject(
            idProject,
            idStep
        )
    ).rejects;
});


test("removeStepFromProject bad project id", async () => {
    await ProjectStepService.addStepToProject(idProject, idStep);
    expect(
        async () => await ProjectStepService.removeStepFromProject(
            "invalid-project-id",
            idStep
        )
    ).rejects;
});


test("removeStepFromProject bad step id", async () => {
    await ProjectStepService.addStepToProject(idProject, idStep);
    expect(
        async () => await ProjectStepService.removeStepFromProject(
            idProject,
            "invalid-step-id"
        )
    ).rejects;
});


test("updatePositionOfStepInProject should work", async () => {
    // await ProjectStepService.addStepToProject(idProject, idStep);
    const step2 = await StepService.createStep({
        createdBy: idUser,
        name: "step2",
        description: "description"
    });
    await ProjectStepService.addStepToProject(idProject, step2.id!);
    expect(
        async () => await ProjectStepService.updatePositionOfStepInProject(
            idProject,
            step2.id!,
            1
        )
    ).resolves;
});


test("updatePositionOfStepInProject non existing", async () => {
    expect(
        async () => await ProjectStepService.updatePositionOfStepInProject(
            idProject,
            idStep,
            2
        )
    ).rejects;
});


test("updatePositionOfStepInProject bad project id", async () => {
    // await ProjectStepService.addStepToProject(idProject, idStep);
    expect(
        async () => await ProjectStepService.updatePositionOfStepInProject(
            "invalid project id",
            idStep,
            2
        )
    ).rejects;
});


test("updatePositionOfStepInProject bad step id", async () => {
    // await ProjectStepService.addStepToProject(idProject, idStep);
    expect(
        async () => await ProjectStepService.updatePositionOfStepInProject(
            idProject,
            "invalid step id",
            2
        )
    ).rejects;
});