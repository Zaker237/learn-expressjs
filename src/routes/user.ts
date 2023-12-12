import express from "express";
import { UserResource } from "../resources";
import { param, body, validationResult } from "express-validator";
import UserService from "src/services/UserService";


export const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - googleId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the User
 *         username:
 *           type: string
 *           description: The username of The User
 *         firstname:
 *           type: string
 *           description: The firstname of The User
 *         lastname:
 *           type: string
 *           description: The lastname of The User
 *         email:
 *           type: string
 *           description: The email of The User
 *         googleId:
 *           type: string
 *           description: The googleId the User
 *         admin:
 *           type: boolean
 *           description: whether or not it's an admin User
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the User was added
 *       example:
 *         id: kjdvbdvd-fbf-vbfdb-fdb
 *         firstname: Alex
 *         lastname: Walker
 *         email: mboutchouangalex@gmail.com
 *         googleId: lkdfdlnfkdlkdv-dshjvsbdv_dsfghsdj
 *         admin: true
 *         createdAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users:
 *   get:
 *     summary: Lists all the user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *  get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *   put:
 *     summary: Update a new User
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */
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


    /**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *  delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 *
 */
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