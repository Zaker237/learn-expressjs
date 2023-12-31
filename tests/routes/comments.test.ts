// @ts-nocxheck
import supertest from "supertest";
import app from "../../src/app";
import UserService from "../../src/services/UserService";
import CardService from "../../src/services/CardService";
import CommentService from "../../src/services/CommentService";
import StepService from "../../src/services/StepService";
import ProjectService from "../../src/services/ProjectService";

let idUser: string
let idCard: string

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
    // create step
    const step = await StepService.createStep({
        createdBy: user.id!,
        name: "step",
        description: "description"
    });
    // create card
    const card = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: project.id!,
        inStep: step.id!,
        title: "Comment",
        description: "description"
    });
    idCard = card.id!;
})


test("/api/v0/comments/ get alle, 6 comment", async () => {
    for (let i = 1; i <= 6; i++) {
        await CommentService.createComment({
            createdBy: idUser,
            belongTo: idCard,
            text: `Comment${i}`
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/comments/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(6);
});


test("/api/v0/comments/user/:userId get alle user comment", async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 50; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CommentService.createComment({
                createdBy: currentNumber === 0 ?  idUser : "invalid-id",
                belongTo: idCard,
                text: `Comment${i}`
            });
        } catch (error) {

        }
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/comments/user/${idUser}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(numOfTrue);
});


test("/api/v0/comments/user/:userId get alle, badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/comments/user/bad-user-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/comments/:id get comment by id", async () => {
    const newComment = await CommentService.createComment({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment"
    });
    const allComments = await CommentService.getAllComments();
    expect(allComments.length).toBe(1);
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/comments/${newComment.id!}`);
    expect(response.statusCode).toBe(200);
});


test("/api/v0/comments/:id get badId", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/comments/id-does-not-exists`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/comments/:id delete comment by id", async () => {
    const newComment = await CommentService.createComment({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment"
    });
    const testee = supertest(app);
    const comments = await CommentService.getAllComments()
    expect(comments.length).toBe(1);
    const response = await testee.delete(`/api/v0/comments/${newComment.id}`);
    const allComments = await CommentService.getAllComments()
    expect(response.statusCode).toBe(200);
    expect(allComments.length).toBe(0);
});


test("/api/v0/comments/:id delete comment by badId", async () => {
    await CommentService.createComment({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment"
    });
    const testee = supertest(app);
    const comments = await CommentService.getAllComments()
    expect(comments.length).toBe(1);
    const response = await testee.delete(`/api/v0/comments/invalid-comment-id`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/comments/ add comment", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/comments/`).send({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment"
    });
    const allComment = await CommentService.getAllComments();
    expect(response.statusCode).toBe(200);
    expect(allComment.length).toBe(1);
});


test("/api/v0/comments/ add comment bad user Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/comments/`).send({
        createdBy: "bad-user-id",
        belongTo: idCard,
        text: "Comment"
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/comments/ add comment bad step Id", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/comments/`).send({
        createdBy: idUser,
        belongTo: "bad-card-id",
        text: "Comment"
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/comments/:id update comment", async () => {
    var newComment = await CommentService.createComment({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment"
    });
    const testee = supertest(app);
    const response = await testee.put(`/api/v0/comments/${newComment.id!}`).send({
        id: newComment.id!,
        createdBy: idUser,
        belongTo: idCard,
        text: "updated-comment"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.text).toBe("updated-comment");
});