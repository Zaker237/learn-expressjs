import express from "express";
import { UserResource } from "../resources";
import { param, body, validationResult } from "express-validator";
import UserService from "../services/UserService";


export const userRouter = express.Router();


userRouter.get("/", async (req, res, next) => {
    try {
        let users: UserResource[] = await UserService.getAllUsers();
        res.status(200)
        res.send(users)
    } catch (err) {
        res.status(404);
        next(err);
    }
})


userRouter.get("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            let user: UserResource = await UserService.getUserById(id)
            res.status(200)
            res.send(user)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


userRouter.post("/",
    body('username').isString().isLength({ min: 1, max: 100 }),
    body('email').isString().isLength({ min: 1, max: 100 }),
    body('googleId').isString().isLength({ min: 1, max: 100 }),
    body('firstname').optional().isString().isLength({ min: 1, max: 100 }),
    body('lastname').optional().isString().isLength({ min: 1, max: 100 }),
    body('admin').optional({values: false}).isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newUser: UserResource = {
                username: body.username,
                firstname: body.firstname || "",
                lastname: body.lastname || "",
                email: body.email,
                googleId: body.googleId,
                admin: body.admin ? true : false
            }
            let createdUser: UserResource = await UserService.createUser(newUser);
            res.status(200)
            res.send(createdUser)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


userRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('username').isString().isLength({ min: 1, max: 100 }),
    body('email').isString().isLength({ min: 1, max: 100 }),
    body('googleId').isString().isLength({ min: 1, max: 100 }),
    body('firstname').optional().isString().isLength({ min: 1, max: 100 }),
    body('lastname').optional().isString().isLength({ min: 1, max: 100 }),
    body('admin').optional({values: false}).isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            const body = req.body

            if (id != body.id)
                throw new Error("different ids")

            let newUser: UserResource = {
                id: body.id,
                username: body.username,
                firstname: body.firstname || "",
                lastname: body.lastname || "",
                email: body.email,
                googleId: body.googleId,
                admin: body.admin ? true : false
            }
            let updatedUser: UserResource = await UserService.updateUser(newUser);
            res.status(200)
            res.send(updatedUser)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


userRouter.delete("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            await UserService.deleteUser(id)
            res.status(200)
            res.send("User has been deleted")
        } catch (err) {
            res.status(404);
            next(err);
        }
    })