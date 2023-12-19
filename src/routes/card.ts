import express from "express";
import CardService from "../services/CardSevice";
import { CardResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const cardRouter = express.Router();


cardRouter.get("/user/:userId",
    param('userId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.userId;
        try {
            const cards = await CardService.getCardsCreatedByUser(id);
            res.send(cards);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.get("/project/:projectId",
    param('projectId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const projectId = req.params?.projectId;
        try {
            const cards = await CardService.getCardsByProjectId(projectId);
            res.send(cards);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.get("/project/:projectId/step/:stepId",
    param('projectId').isString(),
    param('stepId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const projectId = req.params?.projectId;
        const stepId = req.params?.stepId;
        try {
            const cards = await CardService.getCardsByProjectIdAndStepId(projectId, stepId);
            res.send(cards);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.get("/", async (req, res, next) => {
    try {
        let cards: CardResource[] = await CardService.getAllCards();
        res.status(200)
        res.send(cards)
    } catch (err) {
        res.status(404);
        next(err);
    }
})



cardRouter.get("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            let card: CardResource = await CardService.getCardById(id)
            res.status(200)
            res.send(card)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.post("/",
    body('createdBy').isString(),
    body('asignTo').isString(),
    body('belongTo').isString(),
    body('inStep').isString(),
    body('title').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newCard: CardResource = {
                createdBy: body.createdBy,
                asignTo: body.asignTo,
                belongTo: body.belongTo,
                inStep: body.inStep,
                title: body.title,
                description: body.description || ""
            }
            let createdCard: CardResource = await CardService.createCard(newCard);
            res.status(200)
            res.send(createdCard)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('createdBy').isString(),
    body('asignTo').isString(),
    body('belongTo').isString(),
    body('inStep').isString(),
    body('title').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),
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

            let newCard: CardResource = {
                id: body.id,
                createdBy: body.createdBy,
                asignTo: body.asignTo,
                belongTo: body.belongTo,
                inStep: body.inStep,
                title: body.title,
                description: body.description || ""
            }
            let updatedCard: CardResource = await CardService.updateCard(newCard);
            res.status(200)
            res.send(updatedCard)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


cardRouter.delete("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            await CardService.deleteCard(id)
            res.status(200)
            res.send("Card has been deleted")
        } catch (err) {
            res.status(404);
            next(err);
        }
    })