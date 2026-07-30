import { describe, expect, it } from "vitest";
import { TaskStatus } from "../src/generated/prisma/client";
import { isTaskOverdue } from "../src/lib/task-rules";

describe("isTaskOverdue", () => {
  const now = new Date("2026-07-30T12:00:00.000Z");

  it("marks a past-due Todo task as overdue", () => {
    const dueDate = new Date("2026-07-29T12:00:00.000Z");

    expect(
      isTaskOverdue(dueDate, TaskStatus.TODO, now),
    ).toBe(true);
  });

  it("marks a past-due In-Progress task as overdue", () => {
    const dueDate = new Date("2026-07-29T12:00:00.000Z");

    expect(
      isTaskOverdue(
        dueDate,
        TaskStatus.IN_PROGRESS,
        now,
      ),
    ).toBe(true);
  });

  it("does not mark a completed task as overdue", () => {
    const dueDate = new Date("2026-07-29T12:00:00.000Z");

    expect(
      isTaskOverdue(
        dueDate,
        TaskStatus.COMPLETE,
        now,
      ),
    ).toBe(false);
  });

  it("does not mark a future task as overdue", () => {
    const dueDate = new Date("2026-07-31T12:00:00.000Z");

    expect(
      isTaskOverdue(dueDate, TaskStatus.TODO, now),
    ).toBe(false);
  });
});