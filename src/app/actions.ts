"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function createTask(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const topic = formData.get("topic")?.toString().trim();
  const dueDateValue = formData.get("dueDate")?.toString();

  if (!title || !description || !topic || !dueDateValue) {
    throw new Error("All task fields are required.");
  }

  const dueDate = new Date(dueDateValue);

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error("The due date is invalid.");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      topic,
      dueDate,
    },
  });

  revalidatePath("/");
}

export async function updateTask(formData: FormData) {
  const taskId = Number(formData.get("taskId"));
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const topic = formData.get("topic")?.toString().trim();
  const dueDateValue = formData.get("dueDate")?.toString();
  const statusValue = formData.get("status")?.toString();

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error("Invalid task ID.");
  }

  if (!title || !description || !topic || !dueDateValue || !statusValue) {
    throw new Error("All task fields are required.");
  }

  if (
    !Object.values(TaskStatus).includes(statusValue as TaskStatus)
  ) {
    throw new Error("Invalid task status.");
  }

  const dueDate = new Date(dueDateValue);

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error("The due date is invalid.");
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      description,
      topic,
      dueDate,
      status: statusValue as TaskStatus,
    },
  });

  revalidatePath("/");
}

export async function archiveTask(formData: FormData) {
  const taskId = Number(formData.get("taskId"));

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error("Invalid task ID.");
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      archivedAt: new Date(),
    },
  });

  revalidatePath("/");
}