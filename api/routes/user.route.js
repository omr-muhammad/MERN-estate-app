import express from "express";
import { updateUser } from "../controller/user.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router();

router.patch("/update/:id", protect, updateUser);

export default router;
