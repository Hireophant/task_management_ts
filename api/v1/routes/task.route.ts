import express, { Request, Response, Router } from "express";
const router: Router = Router();
import Task from "../../../models/task.model";

router.get("/", async (req: Request, res: Response) => {
    const tasks = await Task.find(
        {
            deleted: false,
        }
    );
    res.json(tasks);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await Task.findOne(
        {
            deleted: false,
            _id: id,
        }
    );
    res.json(task);
});

export const taskRoutes: Router = router;
