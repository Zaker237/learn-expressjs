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


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects:
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


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/{projectId}/steps:
 *   get:
 *     summary: Lists all the projects steps
 *     tags: [Projects]
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


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Projects managing API
 * /api/v0/projects/{projectId}/members:
 *   get:
 *     summary: Lists all the projects members
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
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