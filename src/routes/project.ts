import express from "express";
import ProjectService from "../services/ProjectService";
import StepService from "../services/StepService";
import { ProjectResource, StepResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const projectRouter = express.Router();


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


projectRouter.get("/:projectId/steps",
    param('projectId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.projectId;
        try {
            let steps: StepResource[] = await StepService.getStepsCreatedByProject(id);
            res.status(200)
            res.send(steps)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


projectRouter.post("/",
    body('owner').isString(),
    body('name').isString(),
    body('startAt').isISO8601().toDate(),
    body('endsAt').isISO8601().toDate(),
    body('description').optional().isString(),
    body('public').optional({ values: false }).isBoolean(),
    body('closed').optional({ values: false }).isBoolean(),
    body('githublink').optional().isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newProject: ProjectResource = {
                owner: body.owner,
                name: body.name,
                startAt: body.startAt,
                endsAt: body.endsAt,
                description: body.description || "",
                public: body.public,
                closed: body.closed,
                githublink: body.githublink || ""
            }
            let createdProject: ProjectResource = await ProjectService.createProject(newProject);
            res.status(200)
            res.send(createdProject)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


projectRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('owner').isString(),
    body('name').isString(),
    body('startAt').isISO8601().toDate(),
    body('endsAt').isISO8601().toDate(),
    body('description').optional().isString(),
    body('public').optional({ values: false }).isBoolean(),
    body('closed').optional({ values: false }).isBoolean(),
    body('githublink').optional().isString(),
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
                owner: body.owner,
                name: body.name,
                startAt: body.startAt,
                endsAt: body.endsAt,
                description: body.description || "",
                public: body.public,
                closed: body.closed,
                githublink: body.githublink || ""
            }
            let updatedProject: ProjectResource = await ProjectService.updateProject(newProject);
            res.status(200)
            res.send(updatedProject)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


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