import express, { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as pagesController from "../controllers/pages";

const router: Router = express.Router();

// GET /pages
router.get("/", isAuth, pagesController.getPages);

// GET /pages/{id}
router.get("/:pageId", isAuth, pagesController.getPage);

// POST /pages
router.post("/", isAuth, pagesController.postPage);

// PUT /pages/{id}
router.put("/:pageId", isAuth, pagesController.putPage);

// DELETE /pages/{id}
router.delete("/:pageId", isAuth, pagesController.deletePage);

// POST /pages/images
router.post("/images", pagesController.postImage);

// DELETE /pages/images/{name}
router.delete("/images/:imageName", pagesController.deleteImage);

export = router;
