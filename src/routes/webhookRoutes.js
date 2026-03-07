import express from "express";
import messageHandler from "../services/messageHandler.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await messageHandler(req.body);
  res.sendStatus(200);
});

export default router;