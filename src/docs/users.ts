/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - googleId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the User
 *         username:
 *           type: string
 *           description: The username of The User
 *         firstname:
 *           type: string
 *           description: The firstname of The User
 *         lastname:
 *           type: string
 *           description: The lastname of The User
 *         email:
 *           type: string
 *           description: The email of The User
 *         googleId:
 *           type: string
 *           description: The googleId the User
 *         admin:
 *           type: boolean
 *           description: whether or not it's an admin User
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the User was added
 *       example:
 *         id: kjdvbdvd-fbf-vbfdb-fdb
 *         username: Zaker
 *         firstname: Alex
 *         lastname: Walker
 *         email: mboutchouangalex@gmail.com
 *         googleId: lkdfdlnfkdlkdv-dshjvsbdv_dsfghsdj
 *         admin: true
 *         createdAt: 2023-12-10T04:05:06.157Z
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users:
 *   get:
 *     summary: Lists all the user
 *     tags: [Users]
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *  get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *   put:
 *     summary: Update a new User
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/v0/users/{id}:
 *  delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 *
 */