import type { PrismaClient } from "../generated/prisma/client";

type TaskDatabase = Pick<PrismaClient, "task">;

export async function archiveTaskRecord(
  database: TaskDatabase,
  taskId: number,
) {
  return database.task.update({
    where: {
      id: taskId,
    },
    data: {
      archivedAt: new Date(),
    },
  });
}