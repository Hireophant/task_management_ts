import Task from "../models/task.model";
import { Request, Response } from "express";
import paginationHelper from "../helpers/pagination";
import searchHelper from "../helpers/search";


// [GET] /tasks
export const index = async (req: Request, res: Response) => {
    //Find
    const find = {
        deleted: false,
    };
    if(req.query.status){
        find["status"] = req.query.status;
    }
    //End find

    //search
      const objectSearch = searchHelper(req.query);
      if (objectSearch.regex) {
        find["title"] = objectSearch.regex;
      }
      //End search

    //pagination
  const countTask = await Task.countDocuments(find);
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTask,
  );
  //End pagination

    //Sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    //End sort

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    res.json(tasks);
};

// [GET] /tasks/:id
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

// [PATCH] /tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try{
        const id: string = req.params.id.toString();
        const task = await Task.updateOne(
            {
                _id: id,
            },
            {
                status: req.body.status,
            }
        );
        res.json(
            {
                code: 200,
                message: "Change status success",
            }
        );
    }catch(error){
        res.json(
            {
                code: 400,
                message: "Change status failed",
            }
        );
    }
}

// [PATCH] /tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case "status":
                const tasks = await Task.updateMany(
                    {
                        _id: {
                            $in: { $in: ids },
                        },
                    },
                    {
                        status: value,
                    }
                );
                res.json(
                    {
                        code: 200,
                        message: "Change status success",
                    }
                );
                break;
            case "deleted":
                await Task.updateMany(
                    {
                        _id: {
                            $in: { $in: ids },
                        },
                    },
                    {
                        deleted: true,
                        deletedAt: new Date(),
                    }
                );
                res.json(
                    {
                        code: 200,
                        message: "Change deleted success",
                    }
                );
                break;
            default:
                res.json(
                    {
                        code: 400,
                        message: "Không tồn tại",
                    }
                );
                break;
        }
    }catch(error){
        res.json(
            {
                code: 400,
                message: "Change status failed",
            }
        );
    }
}

// [POST] /tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const task = await Task.create(req.body);
        const data = await task.save();
        res.json(
            {
                code: 200,
                message: "Create task success",
                data: data,
            }
        );
    }catch(error){
        res.json(
            {
                code: 400,
                message: "Create task failed",
            }
        );
    }
}

// [PATCH] /tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id.toString();
        await Task.updateOne(
            {
                _id: id,
            },
            req.body,
        );
        res.json(
            {
                code: 200,
                message: "Edit task success",
            }
        );
    }catch(error){
        res.json(
            {
                code: 400,
                message: "Edit task failed",
            }
        );
    }
}

// [DELETE] /tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id.toString();
        await Task.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        );
        res.json(
            {
                code: 200,
                message: "Delete task success",
            }
        );
    }catch(error){
        res.json(
            {
                code: 400,
                message: "Delete task failed",
            }
        );
    }
}
