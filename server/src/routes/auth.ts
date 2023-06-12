import express from "express";
import * as controller from "../controllers/auth";

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/logout", controller.logout);

export default router;
