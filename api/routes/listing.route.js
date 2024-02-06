import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  getUserListings,
  setUserId,
  updateListing,
} from "../controller/listing.controller.js";
import { protect } from "../controller/auth.controller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getUserListings)
  .post(protect, setUserId, createListing);

router.get("/all", getAllListings);

router
  .route("/:id")
  .get(getListing)
  .delete(protect, deleteListing)
  .patch(protect, updateListing);

export default router;
