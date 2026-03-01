import { taskRepo } from "../repositories/task.repository";

export const commandExecutor = {
    async createTasks(titles: string[]) {
        return taskRepo.createMany(titles);
    },

    async completeTasks(ids: string[]) {
        return taskRepo.complete(ids);
    },

    async appendDetail(taskId: string, content: string, messageHash: string) {
        return taskRepo.appendDetail(taskId, content, messageHash);
    }
};
