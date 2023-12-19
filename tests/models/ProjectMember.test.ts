import { Project } from "../../src/models/ProjectModel";
import { User } from "../../src/models/UserModel";
import { ProjectMember } from "../../src/models/ProjectMemberModel";

let idUser: string;
let idProject: string;

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
    idUser = user.id!;
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
})


test('Genereller Test', async () => {
    let pm1 = {
        projectId: idProject,
        userId: idUser,
        admin: false
    };
    const pm = new ProjectMember(pm1);
    await pm.save();
    let result: any = await ProjectMember.findOne({ projectId: idProject, userId: idUser });
    expect(result).toBeInstanceOf(ProjectMember);
    expect(result.admin).toBe(pm.admin);
});


test('without user', async () => {
    let pm1 = {
        projectId: idProject,
        admin: false
    };
    try{
        const pm = new ProjectMember(pm1);
        await pm.save();
    }catch(e){

    }
    let result: any = await ProjectMember.findOne({ projectId: idProject, userId: idUser });
    expect(result).toBeFalsy();
});

test('without project', async () => {
    let pm1 = {
        userId: idUser,
        admin: false
    };
    try{
        const pm = new ProjectMember(pm1);
        await pm.save();
    }catch(e){

    }
    let result: any = await ProjectMember.findOne({ projectId: idProject, userId: idUser });
    expect(result).toBeFalsy();
});