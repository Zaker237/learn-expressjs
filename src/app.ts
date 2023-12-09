import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { cardRouter } from "./routes/card";
import { commentRouter } from "./routes/comment";
import { stepRouter } from "./routes/step";
import { projectRouter } from "./routes/project";

const app = express();

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Project Management API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger for Project Management",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Alex Mboutchouang",
                url: "https://alexwalker.texh",
                email: "mboutchouangalex@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3002",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

// Middleware:
app.use("*", express.json());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);
app.use("/api/v0/steps", stepRouter);
app.use("/api/v0/comments", commentRouter);
app.use("/api/v0/projects", projectRouter);
app.use("/api/v0/cards", cardRouter);

export default app;