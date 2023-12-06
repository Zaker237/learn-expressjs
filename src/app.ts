import express from 'express';
import "express-async-errors";

const app = express();

// Middleware:
app.use('*', express.json())

export default app;