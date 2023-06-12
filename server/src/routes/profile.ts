import express from "express";
import * as controller from "../controllers/profile";

const router = express.Router();

router.get("/", controller.readUserInfo);
router.patch("/", controller.updateUser);
router.delete("/", controller.deleteUser);

export default router;
