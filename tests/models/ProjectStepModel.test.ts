import { Project } from "../../src/models/ProjectModel";
import { User } from "../../src/models/UserModel";
import { Step } from "../../src/models/StepModel";
import { ProjectStep } from "../../src/models/ProjectStepModel";

let idProject: string;
let idStep: string;

beforeEach(async () => {
    // create a user
    const user1 = {
        username: `username`,
        firstname: `firstname`,
        lastname: `lastname`,
        email: `test@email.test`,
        googleId: `googleId`,
        admin: true
    };
    const user = new User(user1);
    await user.save();
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
    idProject = project.id!;
    let step1 = {
        createdBy: user.id!,
        name: "Backlog1",
        description: "description"
    };
    const step = new Step(step1);
    await step.save();
    idStep = step.id!;
})


test('Genereller Test', async () => {
    let ps1 = {
        projectId: idProject,
        stepId: idStep,
        position: 1
    };
    const ps = new ProjectStep(ps1);
    await ps.save();
    let result: any = await ProjectStep.findOne({ projectId: idProject, stepId: idStep });
    expect(result).toBeInstanceOf(ProjectStep);
    expect(result.position).toBe(ps.position);
});


test('without step', async () => {
    let ps1 = {
        projectId: idProject,
        position: 2
    };
    try{
        const ps = new ProjectStep(ps1);
        await ps.save();
    }catch(e){

    }
    let result: any = await ProjectStep.findOne({ projectId: idProject, setpId: idStep });
    expect(result).toBeFalsy();
});


test('without project', async () => {
    let ps1 = {
        stepId: idStep,
        position: 2
    };
    try{
        const ps = new ProjectStep(ps1);
        await ps.save();
    }catch(e){

    }
    let result: any = await ProjectStep.findOne({ projectId: idProject, stepId: idStep });
    expect(result).toBeFalsy();
});


test('without position', async () => {
    let ps1 = {
        projectId: idProject,
        stepId: idStep,
    };
    try{
        const ps = new ProjectStep(ps1);
        await ps.save();
    }catch(e){

    }
    let result: any = await ProjectStep.findOne({ projectId: idProject, stepId: idStep });
    expect(result).toBeFalsy();
});