import { TaskStatus } from "../generated/prisma/client";

export function isTaskOverdue(
  dueDate: Date,
  status: TaskStatus,
  now: Date = new Date(),
): boolean {
  return (
    dueDate.getTime() < now.getTime() &&
    status !== TaskStatus.COMPLETE
  );
}