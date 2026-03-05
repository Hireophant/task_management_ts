import Task from "../models/task.model";
import { Request, Response } from "express";

export const index = async (req: Request, res: Response) => {
    //Find
    const find = {
        deleted: false,
    };
    if(req.query.status){
        find["status"] = req.query.status;
    }
    //End find

    //Sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    //End sort

    const tasks = await Task.find(find).sort(sort);
    res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await Task.findOne(
        {
            deleted: false,
            _id: id,
        }
    );
    res.json(task);
}