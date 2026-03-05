import Task from "../models/task.model";
import { Request, Response } from "express";
import paginationHelper from "../helpers/pagination";
import searchHelper from "../helpers/search";

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