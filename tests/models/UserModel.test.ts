import { User } from "../../src/models/UserModel";
import mongoose from "mongoose";

test('Genereller Test', async () => {
    let test = {
        username: "username", firstname: "firstname", lastname: false,
        email: "test@email.test", googleId: "googleId"
    }
    const user = new User(test)
    await user.save()
    let result: any = await User.findOne({ name: "username" });
    expect(result).toBeInstanceOf(User);
    expect(result.username).toBe(test.username);
    expect(result.admin).toBe(false);
});

test('without username', async () => {
    let test2 = {
        firstname: "firstname", lastname: false,
        email: "test@email.test", googleId: "googleId"
    }
    const user = new User(test2)
    try {
        await user.save()
    } catch (e) {

    }
    let result: any = await User.findOne({ firstname: "firstname" })
    expect(result).toBeFalsy()
});


test('without email', async () => {
    let test3 = {
        username: "username", firstname: "firstname", lastname: false,
        googleId: "googleId"
    }
    const user = new User(test3)
    try {
        await user.save()
    } catch (e) {
    }
    let result: any = await User.findOne({username: "username"})
    expect(result).toBeFalsy()
});

test('without google Id', async () => {
    let test4 = {
        username: "username4", firstname: "firstname", lastname: false,
        email: "test@email.test"
    }
    const user = new User(test4)
    try {
        await user.save()
    } catch (e) {

    }
    let result: any = await User.findOne({ username: "username4" })
    expect(result).toBeFalsy();
});

test('with admin ', async () => {
    let test5 = {
        username: "username5", firstname: "firstname", lastname: false,
        email: "test@email.test", googleId: "googleId", admin: true
    }
    const user = new User(test5)
    try {
        await user.save()
    } catch (e) {

    }
    let result: any = await User.findOne({ username: "username5" })
    expect(result.admin).toBe(true);
    expect(result).toBeInstanceOf(User);
});