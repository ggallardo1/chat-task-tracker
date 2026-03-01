import { prisma } from "../lib/prisma";

export const taskRepo = {
  list() {
    return prisma.task.findMany({
      include: { details: true },
      orderBy: { createdAt: "desc" }
    });
  },

  createMany(titles: string[]) {
    return Promise.all(
      titles.map((title) =>
        prisma.task.create({
          data: { title }
        })
      )
    );
  },

  complete(ids: string[]) {
    return prisma.task.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });
  },

  appendDetail(taskId: string, content: string, messageHash: string) {
    return prisma.taskDetail.create({
      data: {
        taskId,
        content,
        messageHash
      }
    });
  }
};
