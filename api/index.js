import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => console.log("Connect to DB Successfuly."))
  .catch((err) => console.log(err));

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
