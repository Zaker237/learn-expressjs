import {UserResource} from "../../src/resources";
import UserService from "../../src/services/UserService";


test('getAllUsers should get all user', async () => {
    for(let i=1; i <= 10; i++){
        await UserService.createUser({
            username: `username${i}`,
            firstname: `firstname${i}`,
            lastname: `lastname${i}`,
            email: `test${i}@email.test`,
            googleId: `googleId${i}`
        });
    }
    const result = await UserService.getAllUsers();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(10);
});


test('getUserById: should work', async () => {
    const user1 = await UserService.createUser({
        username: "username1", firstname: "firstname1", lastname: "lastname1",
        email: "test1@email.test", googleId: "googleId"
    });
    const result = await UserService.getUserById(user1.id!);
    expect(result.username).toEqual(user1.username);
    expect(result.email).toEqual(user1.email);
});


test('getUserById: bad id', async () => {
    expect(async () => await UserService.getUserById("invaldid-user-id")).rejects.toThrow(Error);
});


test('should create a new User', async () => {
    const user1: UserResource ={
        username: "username1", firstname: "firstname1", lastname: "lastname1",
        email: "test1@email.test", googleId: "googleId"
    };
    const result = await UserService.createUser(user1);
    expect(result.username).toEqual(user1.username);
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


test('should not create a User with a duplicate user', async () => {
    const user2: UserResource = {
        username: "username2", firstname: "firstname2", lastname: "lastname2",
        email: "test2@email.test", googleId: "googleId2"
    };
    const result = await UserService.createUser(user2);
    expect(result.username).toEqual(user2.username);
    expect( async () => await UserService.createUser(user2)).rejects;
});