import express from "express";
import schoolController from "./school.controller";
import todoController from "./todo.controller";
import userController from "./user.controller";

const router = express.Router();

router.use('/schools', schoolController);
router.use('/todos', todoController);
router.use('/users', userController);

export default router;