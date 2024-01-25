import express from "express";
import { updateMe, deleteMe } from "../controller/user.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router();

router.patch("/updateMe/:id", protect, updateMe);
router.delete("/deleteMe/:id", protect, deleteMe);

export default router;
