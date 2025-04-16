import { Router } from "express";
import { tagController } from "../controllers/tag.controller";

const router = Router();

// Tag routes
router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);
router.post("/", tagController.createTag);
router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

export default router;
