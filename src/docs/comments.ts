/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - createdBy
 *         - belongTo
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the step
 *         createdBy:
 *           type: string
 *           description: The Step author
 *         belongTo:
 *           type: string
 *           description: The Card to wish the Comment belong
 *         text:
 *           type: string
 *           description: The name of your Step
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: kjdvb-dvd-fbf-vbfdb-fdb
 *         createdBy: Alex
 *         belongTo: kdjvjb-dfgdgfdg-gdfghf
 *         text: i'm currently working on this card
 *         createdAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments/user/{userId}:
 *   get:
 *     summary: Lists all the comments by user
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments:
 *   get:
 *     summary: Lists all the comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: The list of the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments/{id}:
 *  get:
 *     summary: Get the comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments:
 *   post:
 *     summary: Create a new Step
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The created comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments/{id}:
 *   put:
 *     summary: Update a new Comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments managing API
 * /api/v0/comments/{id}:
 *  delete:
 *     summary: Remove the comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *
 *     responses:
 *       200:
 *         description: The comment was deleted
 *       404:
 *         description: The comment was not found
 *
 */