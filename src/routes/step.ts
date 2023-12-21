import express from "express";
import StepService from "../services/StepService";
import { StepResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const stepRouter = express.Router();


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