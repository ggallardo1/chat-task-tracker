import { Router } from "express";
import { handleChat } from "../services/chat.service";

const router = Router();

router.post("/", async (req, res) => {
  const { message } = req.body;
  const result = await handleChat(message);
  res.json(result);
});

export default router;
