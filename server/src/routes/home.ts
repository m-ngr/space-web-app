import express from "express";
import * as controller from "../controllers/home";

const router = express.Router();

router.get("/home", controller.search);

export default router;
