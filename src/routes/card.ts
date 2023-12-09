import express from "express";
import CardService from "../services/CardSevice";
import { CardResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const cardRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     card:
 *       type: object
 *       required:
 *         - createdBy
 *         - asignTo
 *         - belongTo
 *         - inStep
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the step
 *         createdBy:
 *           type: string
 *           description: The user that created the Card
 *         asignTo:
 *           type: string
 *           description: The user to wish the card was assigned
 *         belongTo:
 *           type: string
 *           description: The Project to wish the card belong
 *         inStep:
 *           type: string
 *           description: The Step to wish the card belong
 *         title:
 *           type: string
 *           description: The name of your Step
 *         description:
 *           type: string
 *           description: The name of your Step
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: kjdvb-dvd-fbf-vbfdb-fdb
 *         createdBy: Alex
 *         asignTo: Alex
 *         belongTo: App
 *         inStep: Done
 *         title: Init the project
 *         description: Project initialisation and setup
 *         createdAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards/user/{userId}:
 *   get:
 *     summary: Lists all the cards by user
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/commets:
 *   get:
 *     summary: Lists all the cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: The list of the cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards/{id}:
 *  get:
 *     summary: Get the card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *     responses:
 *       200:
 *         description: The card response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: The card was not found
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards:
 *   post:
 *     summary: Create a new Step
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: The created card.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       500:
 *         description: Some server error
 *
 */
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards/{id}:
 *   put:
 *     summary: Update a new card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: The updated card.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       500:
 *         description: Some server error
 *
 */
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


    /**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The cards managing API
 * /api/v0/cards/{id}:
 *  delete:
 *     summary: Remove the card by id
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card id
 *
 *     responses:
 *       200:
 *         description: The card was deleted
 *       404:
 *         description: The card was not found
 *
 */
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