import express, { Router } from "express";
const router: Router = Router();
import { requireAuth } from "../middleware/auth.middleware";

import * as controller from "../controller/user.controller";

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/detail", requireAuth, controller.detail);

export const userRoutes: Router = router;