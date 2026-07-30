"use server";

import { revalidatePath } from "next/cache";
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