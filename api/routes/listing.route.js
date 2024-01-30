import express from "express";
import { createListing, setUserId } from "../controller/listing.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router();

router.route("/").post(protect, setUserId, createListing);

export default router;
