import express from "express";
import StepService from "../services/StepService";
import ProjectStepService from "../services/ProjectStepService";
import { StepResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const stepRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Step:
 *       type: object
 *       required:
 *         - name
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the step
 *         name:
 *           type: string
 *           description: The name of your Step
 *         createdBy:
 *           type: string
 *           description: The Step author
 *         description:
 *           type: string
 *           description: The Description of the staep
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: kjdvbdvd-fbf-vbfdb-fdb
 *         title: Done
 *         createdBy: Alex
 *         description: The step for card that habe been finished
 *         createdAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps:
 *   get:
 *     summary: Lists all the steps
 *     tags: [Steps]
 *     responses:
 *       200:
 *         description: The list of the steps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 *
 */
stepRouter.get("/", async (req, res, next) => {
    try {
        let steps: StepResource[] = await StepService.getAllSteps();
        res.status(200)
        res.send(steps)
    } catch (err) {
        res.status(404);
        next(err);
    }
})


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps:
 *   get:
 *     summary: Lists all the steps
 *     tags: [Steps]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *     responses:
 *       200:
 *         description: The list of the steps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 *
 */
stepRouter.get("/project/:projectId",
    param('projectId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.ProjectId;
        try {
            let steps: StepResource[] = await StepService.getStepsCreatedByProject(id);
            res.status(200)
            res.send(steps)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps/{id}:
 *  get:
 *     summary: Get the step by id
 *     tags: [Steps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The step id
 *     responses:
 *       200:
 *         description: The step response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *       404:
 *         description: The step was not found
 *
 */
stepRouter.get("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            let step: StepResource = await StepService.getStepById(id)
            res.status(200)
            res.send(step)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps:
 *   post:
 *     summary: Create a new Step
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Step'
 *     responses:
 *       200:
 *         description: The created step.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *       500:
 *         description: Some server error
 *
 */
stepRouter.post("/",
    body('createdBy').isString(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newStep: StepResource = {
                createdBy: body.createdBy,
                name: body.name,
                description: body.description ? body.description : ""
            }
            let createdStep: StepResource = await StepService.createStep(newStep);
            res.status(200)
            res.send(createdStep)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps/{id}:
 *   put:
 *     summary: Update a new Step
 *     tags: [Steps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The step id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Step'
 *     responses:
 *       200:
 *         description: The created step.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Step'
 *       500:
 *         description: Some server error
 *
 */
stepRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('createdBy').isString(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString(),
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

            let newStep: StepResource = {
                id: body.id,
                createdBy: body.createdBy,
                name: body.name,
                description: body.description ? body.description : ""
            }
            let updatedStep: StepResource = await StepService.updateStep(newStep);
            res.status(200)
            res.send(updatedStep)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
* @swagger
* tags:
*   name: Steps
*   description: The Steps managing API
* /api/v0/steps/{id}:
*  delete:
*     summary: Remove the step by id
*     tags: [Steps]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The step id
*
*     responses:
*       200:
*         description: The step was deleted
*       404:
*         description: The step was not found
*
*/
stepRouter.delete("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            await StepService.deleteStep(id)
            res.status(200)
            res.send("Step has been deleted")
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


/**
 * @swagger
 * tags:
 *   name: Steps
 *   description: The Steps managing API
 * /api/v0/steps/user/{userId}:
 *   get:
 *     summary: Lists all the steps by user
 *     tags: [Steps]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the steps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 *
 */
stepRouter.get("/user/:userId",
    param('userId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.userId;
        try {
            const steps = await StepService.getStepsCreatedByUser(id);
            res.send(steps);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })