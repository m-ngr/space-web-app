import express from "express";
import * as controller from "../controllers/assets";

const router = express.Router();

router.get("/search", controller.search);
router.get("/liked", controller.getLikedAsset);
router.get("/:id", controller.getAsset);
router.post("/:id", controller.likeAsset);
router.delete("/:id", controller.unlikeAsset);

export default router;
