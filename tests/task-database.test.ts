import Database from "better-sqlite3";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  PrismaClient,
  TaskStatus,
} from "../src/generated/prisma/client";
import { archiveTaskRecord } from "../src/lib/task-service";

let testDirectory = "";
let prisma: PrismaClient | undefined;

function applyMigrations(databasePath: string) {
  const database = new Database(databasePath);

  try {
    const migrationsDirectory = join(
      process.cwd(),
      "prisma",
      "migrations",
    );

    const migrationFolders = readdirSync(
      migrationsDirectory,
      {
        withFileTypes: true,
      },
    )
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const folder of migrationFolders) {
      const migrationPath = join(
        migrationsDirectory,
        folder,
        "migration.sql",
      );

      const migrationSql = readFileSync(
        migrationPath,
        "utf8",
      );

      database.exec(migrationSql);
    }
  } finally {
    database.close();
  }
}

beforeEach(() => {
  testDirectory = mkdtempSync(
    join(tmpdir(), "todo-app-test-"),
  );

  const databasePath = join(
    testDirectory,
    "test.db",
  );

  applyMigrations(databasePath);

  const databaseUrl = `file:${databasePath.replaceAll(
    "\\",
    "/",
  )}`;

  const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
  });

  prisma = new PrismaClient({
    adapter,
  });
});

afterEach(async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }

  rmSync(testDirectory, {
    recursive: true,
    force: true,
  });
});

describe("task archiving", () => {
  it("removes a task from the active list without deleting it", async () => {
    if (!prisma) {
      throw new Error("Test database was not created.");
    }

    const task = await prisma.task.create({
      data: {
        title: "Archive test task",
        description: "Confirm archiving preserves the task.",
        dueDate: new Date(
          "2026-08-03T10:00:00.000Z",
        ),
        topic: "Testing",
        status: TaskStatus.TODO,
      },
    });

    await archiveTaskRecord(prisma, task.id);

    const activeTasks = await prisma.task.findMany({
      where: {
        archivedAt: null,
      },
    });

    const archivedTasks = await prisma.task.findMany({
      where: {
        archivedAt: {
          not: null,
        },
      },
    });

    const totalTaskCount = await prisma.task.count();

    expect(activeTasks).toHaveLength(0);
    expect(archivedTasks).toHaveLength(1);
    expect(archivedTasks[0].id).toBe(task.id);
    expect(archivedTasks[0].archivedAt).toBeInstanceOf(
      Date,
    );
    expect(totalTaskCount).toBe(1);
  });
});