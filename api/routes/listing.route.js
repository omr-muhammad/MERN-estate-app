import express from "express";
import {
  createListing,
  deleteListing,
  getUserListings,
  setUserId,
} from "../controller/listing.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getUserListings)
  .post(protect, setUserId, createListing);

router.route("/:id").delete(protect, deleteListing);
export default router;
