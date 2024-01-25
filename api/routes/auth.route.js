import express from "express";
import {
  google,
  signin,
  signup,
  singout,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", singout);

export default router;
