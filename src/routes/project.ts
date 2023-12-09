import express from "express";
import ProjectService from "../services/ProjectService";
import { ProjectResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const projectRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - owner
 *         - name
 *         - startAt
 *         - endsAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the step
 *         owner:
 *           type: string
 *           description: The Project owner
 *         name:
 *           type: string
 *           description: The Project name
 *         description:
 *           type: string
 *           description: The project description
 *         startAt:
 *           type: string
 *           format: date
 *           description: the project's start date
 *         endsAt:
 *           type: string
 *           format: date
 *           description: the project's deadline
 *         public:
 *           type: boolean
 *           description: whether or not the project is public
 *         closed:
 *           type: string
 *           description: whether or not the project was closed
 *         githublink:
 *           type: string
 *           description: the project's github repos
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: the project's last update date
 *       example:
 *         id: kjdvb-dvd-fbf-vbfdb-fdb
 *         owner: Alex
 *         name: App
 *         description: App development
 *         startAt: 2023-12-10T04:05:06.157Z
 *         endsAt: 2024-12-10T04:05:06.157Z
 *         public: true
 *         closed: false
 *         githublink: https://github.com/Zaker237/learn-expressjs
 *         createdAt: 2023-12-10T04:05:06.157Z
 *         updatedAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/user/{userId}:
 *   get:
 *     summary: Lists all the projects by user
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *
 */
projectRouter.get("/user/:userId",
    param('userId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.userId;
        try {
            const projects = await ProjectService.getProjectsCreatedByUser(id);
            res.send(projects);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/commets:
 *   get:
 *     summary: Lists all the projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: The list of the projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *
 */
projectRouter.get("/", async (req, res, next) => {
    try {
        let projects: ProjectResource[] = await ProjectService.getAllProjects();
        res.status(200)
        res.send(projects)
    } catch (err) {
        res.status(404);
        next(err);
    }
})


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/{id}:
 *  get:
 *     summary: Get the project by id
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *     responses:
 *       200:
 *         description: The project response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: The project was not found
 *
 */
projectRouter.get("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            let project: ProjectResource = await ProjectService.getProjectById(id)
            res.status(200)
            res.send(project)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects:
 *   post:
 *     summary: Create a new Step
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: The created project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Some server error
 *
 */
projectRouter.post("/",
    body('owner').isString(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('startAt').isDate(),
    body('endsAt').isDate(),
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),
    body('public').optional({values: false}).isBoolean(),
    body('closed').optional({values: false}).isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newProject: ProjectResource = {
                owner: body.createdBy,
                name: body.name,
                startAt: body.startAt,
                endsAt: body.endsAt,
                description: body.description ? body.description : "",
                public: body.public,
                closed: body.closed,
                githublink: body.githublink
            }
            let createdProject: ProjectResource = await ProjectService.createProject(newProject);
            res.status(200)
            res.send(createdProject)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/{id}:
 *   put:
 *     summary: Update a new project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: The updated project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Some server error
 *
 */
projectRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('owner').isString(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('startAt').isDate(),
    body('endsAt').isDate(),
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),
    body('public').optional({values: false}).isBoolean(),
    body('closed').optional({values: false}).isBoolean(),
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

            let newProject: ProjectResource = {
                id: body.id,
                owner: body.createdBy,
                name: body.name,
                startAt: body.startAt,
                endsAt: body.endsAt,
                description: body.description ? body.description : "",
                public: body.public,
                closed: body.closed,
                githublink: body.githublink
            }
            let updatedProject: ProjectResource = await ProjectService.updateProject(newProject);
            res.status(200)
            res.send(updatedProject)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


    /**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/{id}:
 *  delete:
 *     summary: Remove the project by id
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *
 *     responses:
 *       200:
 *         description: The project was deleted
 *       404:
 *         description: The project was not found
 *
 */
projectRouter.delete("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            await ProjectService.deleteProject(id)
            res.status(200)
            res.send("project has been deleted")
        } catch (err) {
            res.status(404);
            next(err);
        }
    })