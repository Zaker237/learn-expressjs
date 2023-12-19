/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
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
 *     summary: Lists all the cards filter by user
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards/project/{projectId}:
 *   get:
 *     summary: Lists all the cards filter by project
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards/project/{projectId}/step/{stepId}:
 *   get:
 *     summary: Lists all the cards filter by project and step
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *       - in: path
 *         name: stepId
 *         schema:
 *           type: string
 *         required: true
 *         description: The step id
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


/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: The Cards managing API
 * /api/v0/cards:
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