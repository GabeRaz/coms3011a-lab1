# Database Design

## Overview

The application uses a local SQLite database managed through Prisma ORM.

The database contains one table, `Task`, which stores both active and archived tasks. The application is designed for a single local user, so no user or authentication tables are required.

## Database Schema

### Task Table

The `Task` table stores all task information.

| Column | Prisma type | Required | Default | Purpose |
|---|---|---:|---|---|
| `id` | `Int` | Yes | Auto-incremented | Primary key that uniquely identifies each task |
| `title` | `String` | Yes | None | Stores the task title |
| `description` | `String` | Yes | None | Stores the task description |
| `dueDate` | `DateTime` | Yes | None | Stores the date and time by which the task should be completed |
| `topic` | `String` | Yes | None | Stores the task topic or category |
| `status` | `TaskStatus` | Yes | `TODO` | Stores the task's current fixed status |
| `archivedAt` | `DateTime?` | No | `null` | Stores the date and time at which the task was archived |
| `createdAt` | `DateTime` | Yes | Current date and time | Records when the task was created |
| `updatedAt` | `DateTime` | Yes | Automatically updated | Records when the task was last modified |

The `id` field is the primary key and uses automatic integer incrementation.

## Task Status

The `status` column uses the `TaskStatus` enum.

The enum permits exactly three values:

```text
TODO
IN_PROGRESS
COMPLETE
```

These values are displayed in the interface as:

| Stored value | Displayed value |
|---|---|
| `TODO` | Todo |
| `IN_PROGRESS` | In-Progress |
| `COMPLETE` | Complete |

The status defaults to `TODO` when a task is created.

The statuses are fixed and cannot be customised by the user.

## Relationships

The database contains only one table, `Task`.

There are therefore no foreign keys or relationships between separate tables.

The `topic` value is stored directly as text on each task rather than being placed in a separate `Topic` table. This is appropriate because the application does not require users to create, edit or manage topic records independently.

## Archiving Design

Tasks are never deleted from the database.

Archiving is implemented using the nullable `archivedAt` column:

- An active task has `archivedAt` set to `null`.
- An archived task has `archivedAt` set to the date and time at which it was archived.

Active tasks are retrieved using the equivalent of:

```text
archivedAt = null
```

Archived tasks are retrieved using the equivalent of:

```text
archivedAt is not null
```

This design keeps active and archived tasks in the same table and ensures that archived tasks remain stored and viewable.

It avoids copying tasks into a separate archive table and prevents archived task information from being lost.

## Overdue Design

Overdue is not stored as a database column and is not included as a task status.

A task is calculated as overdue when:

1. Its due date is earlier than the current date and time; and
2. Its status is not `COMPLETE`.

This rule is evaluated when task data is read and displayed.

Deriving overdue status at read time prevents the database from storing a value that could become outdated as time passes. It also preserves the requirement that tasks have only the three fixed statuses: Todo, In-Progress and Complete.

## Indexes

The following database indexes are defined:

| Indexed column | Purpose |
|---|---|
| `topic` | Supports sorting and searching tasks by topic |
| `status` | Supports sorting and filtering tasks by status |
| `dueDate` | Supports sorting tasks by due date |
| `archivedAt` | Supports separating active and archived tasks |

These indexes correspond to the application's common queries and sorting options.

## Prisma Schema

The database is represented by the following Prisma schema:

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETE
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String
  dueDate     DateTime
  topic       String
  status      TaskStatus @default(TODO)
  archivedAt  DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([topic])
  @@index([status])
  @@index([dueDate])
  @@index([archivedAt])
}
```

## Design Summary

The database design uses a single `Task` table because all stored information belongs directly to a task and no independent related entities are required.

The design provides:

- Persistent SQLite storage
- Fixed task statuses
- Non-destructive task archiving
- Derived overdue behaviour
- Automatic creation and update timestamps
- Indexes supporting the application's required sorting and archive queries