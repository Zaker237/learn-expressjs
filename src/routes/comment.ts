import express from "express";
import CommentService from "../services/CommentService";
import { CommentResource } from "../resources";
import { param, body, validationResult } from "express-validator";


export const commentRouter = express.Router();


commentRouter.get("/user/:userId",
    param('userId').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.userId;
        try {
            const comments = await CommentService.getCommentsCreatedByUser(id);
            res.send(comments);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


commentRouter.get("/", async (req, res, next) => {
    try {
        let comments: CommentResource[] = await CommentService.getAllComments();
        res.status(200)
        res.send(comments)
    } catch (err) {
        res.status(404);
        next(err);
    }
})


commentRouter.get("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            let comment: CommentResource = await CommentService.getCommentById(id)
            res.status(200)
            res.send(comment)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


commentRouter.post("/",
    body('createdBy').isString(),
    body('belongTo').isString(),
    body('text').isString().isLength({ min: 1, max: 1000 }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const body = req.body
            let newComment: CommentResource = {
                createdBy: body.createdBy,
                belongTo: body.belongTo,
                text: body.text
            }
            let createdComment: CommentResource = await CommentService.createComment(newComment);
            res.status(200)
            res.send(createdComment)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


commentRouter.put("/:id",
    param('id').isString(),
    body('id').isString(),
    body('createdBy').isString(),
    body('belongTo').isString(),
    body('text').isString().isLength({ min: 1, max: 1000 }),
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

            let newComment: CommentResource = {
                id: body.id,
                createdBy: body.createdBy,
                belongTo: body.belongTo,
                text: body.text
            }
            let updatedComment: CommentResource = await CommentService.updateComment(newComment);
            res.status(200)
            res.send(updatedComment)
        } catch (err) {
            res.status(404);
            next(err);
        }
    })


commentRouter.delete("/:id",
    param('id').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params?.id;
        try {
            await CommentService.deleteComment(id)
            res.status(200)
            res.send("Comment has been deleted")
        } catch (err) {
            res.status(404);
            next(err);
        }
    })