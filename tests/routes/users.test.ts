// @ts-nocxheck
import supertest from "supertest";
import app from "../../src/app";
import UserService from "../../src/services/UserService";


test("/api/v0/users/ get alle, 5 Users", async () => {
    for (let i = 1; i <= 5; i++) {
        await UserService.createUser({
            username: `username${i}`,
            firstname: `firstname${i}`,
            lastname: `lastname${i}`,
            email: `test${i}@email.test`,
            googleId: `googleId${i}`,
            admin: 0 % 2 === 0 ? true : false
        });
    }
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/users/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(5);
});


test("/api/v0/users/:id get user by id", async () => {
    var newUser = await UserService.createUser({
        username: "username2",
        email: "test2@email.test",
        googleId: "googleId2",
    });
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/users/${newUser.id}`);
    const allUsers = await UserService.getAllUsers();
    expect(response.statusCode).toBe(200);
    expect(allUsers.length).toBe(1);
});


test("/api/v0/users/:id get user by badID", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/v0/users/klklsahflksblkbsfkldb`);
    const allUsers = await UserService.getAllUsers();
    expect(response.statusCode).toBe(404);
});


test("/api/v0/users/:id delete user by id", async () => {
    var newUser = await UserService.createUser({
        username: "username3",
        email: "test3@email.test",
        googleId: "googleId3",
    });
    const testee = supertest(app);
    const users = await UserService.getAllUsers();
    expect(users.length).toBe(1);
    const response = await testee.delete(`/api/v0/users/${newUser.id}`);
    const allUsers = await UserService.getAllUsers();
    expect(response.statusCode).toBe(200);
    expect(allUsers.length).toBe(0);
});


test("/api/v0/users/:id delete user by id", async () => {
    const testee = supertest(app);
    const response = await testee.delete(`/api/v0/users/jbvkjvbfkdjdhvkjdsbkvj`);
    expect(response.statusCode).toBe(404);
});


test("/api/v0/users/ add user", async () => {
    const testee = supertest(app);
    const response = await testee.post(`/api/v0/users/`).send({
        username: "username4",
        firstname: "firstname4",
        email: "test4@email.test",
        googleId: "googleId4",
    });
    const allPfleger = await UserService.getAllUsers();
    expect(response.statusCode).toBe(200);
    expect(allPfleger.length).toBe(1);
});


test("/api/v0/users/ add user sur existing email", async () => {
    const testee = supertest(app);
    await testee.post(`/api/v0/users/`).send({
        username: "username44",
        firstname: "firstname44",
        email: "test4@email.test",
        googleId: "googleId44",
    });
    const response = await testee.post(`/api/v0/users/`).send({
        username: "username4",
        firstname: "firstname4",
        email: "test4@email.test",
        googleId: "googleId4",
    });
    expect(response.statusCode).toBe(404);
});


test("/api/v0/users/:id update user", async () => {
    var newUser = await UserService.createUser({
        username: "username5",
        firstname: "firstname5",
        lastname: "lastname5",
        email: "test5@email.test",
        googleId: "googleId5",
    });
    const testee = supertest(app);
    const response = await testee.put(`/api/v0/users/${newUser.id}`).send({
        id: newUser.id!,
        username: "username5",
        firstname: "firstname555",
        lastname: "lastname5",
        email: "test5@email.test",
        googleId: "googleId5",
        admin: true
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.firstname).toBe("firstname555");
});