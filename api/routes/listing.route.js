import express from "express";
import {
  createListing,
  getUserListings,
  setUserId,
} from "../controller/listing.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getUserListings)
  .post(protect, setUserId, createListing);

export default router;
