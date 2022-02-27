import express from "express";
import Todo from "../model/todo.model";

type TodoType = {
    text: string;
};

const router = express.Router();

router.get('/', async (req, res) => {
    const todos: Todo[] = await Todo.findAll();
    return res.status(200).json(todos);
});

router.get('/:todoId', async (req, res) => {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json();
    }

    const todoIdNumber: number = parseInt(todoId, 10);
    const todo: Todo | null = await Todo.findByPk(todoIdNumber);
    if (!todo) {
        return res.status(404).json();
    }
    return res.status(200).json(todo);
});

router.post('/', async (req, res) => {
    const { text } = req.body as TodoType;
    if (!text) {
        return res.status(400).json();
    }
    await Todo.create({
        text: text,
    });
    return res.status(201).json();
});

router.delete('/:todoId', async (req, res) => {
    const { todoId } = req.params;
    if (!todoId) {
        return res.status(400).json();
    }

    const todoIdNumber: number = parseInt(todoId, 10);
    const todo: Todo | null = await Todo.findByPk(todoIdNumber);
    if (!todo) {
        return res.status(404).json();
    }

    await Todo.destroy({
        where: { id: todoIdNumber }
    });

    return res.status(200).json();
});

export default router;