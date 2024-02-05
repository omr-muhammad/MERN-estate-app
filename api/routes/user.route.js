import express from "express";

import listingRouter from "./listing.route.js";
import {
  updateMe,
  deleteMe,
  getUserById,
} from "../controller/user.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router();

router.use("/:userId/listings", listingRouter);

router.patch("/updateMe/:id", protect, updateMe);
router.delete("/deleteMe/:id", protect, deleteMe);

router.route("/:id").get(protect, getUserById);

export default router;
