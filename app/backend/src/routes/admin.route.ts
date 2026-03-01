import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/reset", async (_, res) => {
    await prisma.taskDetail.deleteMany();
    await prisma.task.deleteMany();
    await prisma.inboundMessage.deleteMany();

    res.json({ message: "System reset complete." });
});

export default router;
