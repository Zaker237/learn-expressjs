import {UserResource} from "../../src/resources";
import {User} from "../../src/models/UserModel";
import UserService from "../../src/services/UserService";


test('should create a new User', async () => {
    const user1: UserResource ={
        username: "username1", firstname: "firstname1", lastname: "lastname1",
        email: "test1@email.test", googleId: "googleId"
    };
    const result = await UserService.createUser(user1);
    expect(result.username).toEqual(user1.username);
});


test('should not create a User with a duplicate email, username or googleId', async () => {
    const user2: UserResource = {
        username: "username2", firstname: "firstname2", lastname: "lastname2",
        email: "test2@email.test", googleId: "googleId2"
    };
    const result = await UserService.createUser(user2);
    expect(async () => await UserService.createUser(user2)).rejects;

});


test('should not update a non-existent User', async () => {
    const user3: UserResource = {
        username: "username3", firstname: "firstname3", lastname: "lastname3",
        email: "test3@email.test", googleId: "googleId3"
    };

    expect(async () => await UserService.updateUser(user3)).rejects.toThrow();
});


test('should not delete a non-existent User', async () => {
    const user4: UserResource ={
        id: "this-id-does-not-exists",
        username: "username4", firstname: "firstname4", lastname: "lastname4",
        email: "test4@email.test", googleId: "googleId4"
    };
    expect(async () => await UserService.deleteUser(user4.id!)).rejects.toThrow()
});

test('should delete User', async () => {
    const user5: UserResource = {
        username: "username5", firstname: "firstname5", lastname: "lastname5",
        email: "test5@email.test", googleId: "googleId5"
    };
    const result = await UserService.createUser(user5);
    expect(result.username).toEqual(user5.username);
    expect(async () => await UserService.deleteUser(result.id!)).rejects.toThrow();
});

test('should create a new User', async () => {
    const user1: UserResource = {
        username: "username1", firstname: "firstname1", lastname: "lastname1",
        email: "test1@email.test", googleId: "googleId"
    };

    const result = await UserService.createUser(user1);
    expect(result.username).toEqual(user1.username);
});