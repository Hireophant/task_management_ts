import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";
import { generateRandomString } from "../../../helpers/generate";

// [POST] /users/register
export const register = async (req: Request, res: Response) => {
    const  emailExit = await User.findOne({
        email: req.body.email,
        deleted: false,
    });
    if(emailExit){
        res.json(
            {
                code: 400,
                message: "Email already exists",
            }
        );
    }
    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(30);
    const user = new User(req.body);
    const data = await user.save();


    const token = data.token;
    res.cookie("token", token);


    res.json(
        {
            code: 200,
            message: "Register success",
            token: token,
        }
    );
}

// [POST] /users/login
export const login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });
    if(!user){
        res.json(
            {
                code: 400,
                message: "Email not found",
            }
        );
    }
    if(user.password !== md5(password)){
        res.json(
            {
                code: 400,
                message: "Password not match",
            }
        );
    }
    const token = user.token;
    res.cookie("token", token);
    res.json(
        {
            code: 200,
            message: "Login success",
            token: token,
        }
    );
}

// [GET] /users/detail/:id
export const detail = async (req: Request, res: Response) => {
    res.json(
        {
            code: 200,
            message: "Detail user success",
            info: req["user"],
        }
    );
}
    