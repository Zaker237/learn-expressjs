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