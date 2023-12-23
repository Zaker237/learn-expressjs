// @ts-nocxheck
import supertest from "supertest";
import {CommentResource} from "../../src/resources";
import UserService from "../../src/services/UserService";
import CardService from "../../src/services/CardService";
import CommentService from "../../src/services/CommentService";
import ProjectService from "../../src/services/ProjectService";
import StepService from "../../src/services/StepService";


let idUser: string;
let idCard: string;

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
    const project = await ProjectService.createProject({
        owner: user.id!,
        name: "Project1",
        description: "description1",
        startAt: new Date(),
        endsAt: new Date(),
        public: false,
        closed: false,
        githublink: "",
    });
    // create step
    const step = await StepService.createStep({
        createdBy: user.id!,
        name: "step1",
        description: "description"
    });
    // create card
    const card = await CardService.createCard({
        createdBy: idUser,
        asignTo: idUser,
        belongTo: project.id!,
        inStep: step.id!,
        title: "Card",
        description: "description"
    });
    idCard = card.id!;
});


test('getAllComments should get all card', async () => {
    for(let i=1; i <= 10; i++){
        await CommentService.createComment({
            createdBy: idUser,
            belongTo: idCard,
            text: `Comment1${i}`
        });
    }
    const result = await CommentService.getAllComments();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(10);
});


test('should get Comment by id', async () => {
    const comment = await CommentService.createComment({
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    });
    const result = await CommentService.getCommentById(comment.id!);
    expect(result.text).toEqual(comment.text);
});


test('should not get Comment by id: bad id', async () => {
    expect(async () => await CommentService.getCommentById("invaldid-comment-id")).rejects;
});


test('getCommentsCreatedByUser should get all comment created by a user', async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 50; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CommentService.createComment({
                createdBy: currentNumber === 0 ?  idUser : "invalid-user-id",
                belongTo: idCard,
                text: `Comment${i}`
            });
        } catch (error) {

        }
    }
    const result = await CommentService.getCommentsCreatedByUser(idUser);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(numOfTrue);
});


test('getCommentsCreatedByUser: bad id', async () => {
    expect(async () => await CommentService.getCommentsCreatedByUser("invaldid-user-id")).rejects;
});


test('getCommentsBelongToCard should get all comment of by card', async () => {
    let numOfTrue = 0;
    for (let i = 1; i <= 50; i++) {
        try {
            const currentNumber = Math.floor(Math.random() * (2 - 1 + 1) + 1);
            numOfTrue += currentNumber === 0 ? 1 : 0;
            await CommentService.createComment({
                createdBy: idUser,
                belongTo: currentNumber === 0 ?  idCard : "invalid-card-id",
                text: `Comment${i}`
            });
        } catch (error) {

        }
    }
    const result = await CommentService.getCommentsBelongToCard(idCard);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(numOfTrue);
});


test('getCommentsBelongToCard: bad id', async () => {
    expect(async () => await CommentService.getCommentsBelongToCard("invaldid-card-id")).rejects;
});


test('should create a new Comment', async () => {
    const comment1: CommentResource = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    };
    const result = await CommentService.createComment(comment1);
    expect(result.text).toEqual(comment1.text);
});


test('should not create a new Comment: bad user id', async () => {
    const comment2: CommentResource = {
        createdBy: "invalid-user-id",
        belongTo: idCard,
        text: "Comment2"
    };
    expect(async () => await CommentService.createComment(comment2)).rejects;
});


test('should not create a new Card: bad card  id', async () => {
    const comment3: CommentResource = {
        createdBy: idUser,
        belongTo: "invalid-card-id",
        text: "Comment2´3"
    };
    expect(async () => await CommentService.createComment(comment3)).rejects;
});


test('should update the comment', async () => {
    const comment4: CommentResource = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    };
    const result = await CommentService.createComment(comment4);
    expect(result.text).toEqual(comment4.text);
    result.text = "updated-text";
    const updatedResult = await CommentService.updateComment(result);
    expect(updatedResult.text).toEqual("updated-text");
});


test('should not update comment bad user id', async () => {
    const comment5: CommentResource = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    };
    const result = await CommentService.createComment(comment5);
    expect(result.text).toEqual(comment5.text);
    result.text = "updated-text";
    result.createdBy = "this-id-does-not-exist";
    expect(async () => await CommentService.updateComment(result)).rejects;
});


test('should not update comment bad card id', async () => {
    const comment6: CommentResource = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    };
    const result = await CommentService.createComment(comment6);
    expect(result.text).toEqual(comment6.text);
    result.text = "updated-text";
    result.belongTo = "this-id-does-not-exist";
    expect(async () => await CommentService.updateComment(result)).rejects;
});


test('should delete Comment', async () => {
    const comment7: CommentResource = {
        createdBy: idUser,
        belongTo: idCard,
        text: "Comment1"
    };
    const result = await CommentService.createComment(comment7);
    expect(result.text).toEqual(comment7.text);
    expect(async () => await CommentService.deleteComment(result.id!)).resolves;
});


test('should not delete Comment: bad Id', async () => {
    expect(async () => await CommentService.deleteComment("this-id-does-not-exist")).resolves;
});