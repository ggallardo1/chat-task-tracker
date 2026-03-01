import { Router } from "express";
import { taskRepo } from "../repositories/task.repository";

const router = Router();

router.get("/", async (_, res) => {
  const tasks = await taskRepo.list();
  res.json(tasks);
});

export default router;
