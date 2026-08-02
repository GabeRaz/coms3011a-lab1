import {Prisma} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  archiveTask,
  createTask,
  updateTask,
} from "./actions";
import { isTaskOverdue } from "@/lib/task-rules";

function formatDateTimeInput(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function formatStatus(status: string) {
  if (status === "IN_PROGRESS") {
    return "In-Progress";
  }

  if (status === "COMPLETE") {
    return "Complete";
  }

  return "Todo";
}

type SortOption = "dueDate" | "topic" | "status";

type HomeProps = {
  searchParams: Promise<{
    sort?: string | string[];
  }>;
};

function isSortOption(
  value: string | undefined,
): value is SortOption {
  return (
    value === "dueDate" ||
    value === "topic" ||
    value === "status"
  );


function getTaskOrder(
  sort: SortOption,
): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "topic":
      return [
        { topic: "asc" },
        { dueDate: "asc" },
      ];

    case "status":
      return [
        { status: "desc" },
        { dueDate: "asc" },
      ];

    case "dueDate":
    default:
      return [
        { dueDate: "asc" },
      ];
  }
}

export default async function Home({
  searchParams,
}: HomeProps) {
  const parameters = await searchParams;

  const requestedSort = Array.isArray(parameters.sort)
    ? parameters.sort[0]
    : parameters.sort;

  const sort: SortOption = isSortOption(requestedSort)
    ? requestedSort
    : "dueDate";

  const orderBy = getTaskOrder(sort);

  const [activeTasks, archivedTasks] = await Promise.all([
    prisma.task.findMany({
      where: {
        archivedAt: null,
      },
      orderBy,
    }),

    prisma.task.findMany({
      where: {
        archivedAt: {
          not: null,
        },
      },
      orderBy: {
        archivedAt: "desc",
      },
    }),
  ]);

  return (
    <main>
      <h1>Todo Application</h1>

      <section>
        <h2>Create a task</h2>

       <form action={createTask} className="task-form">
  <div className="form-column">
    <div className="form-field">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        required
      />
    </div>

    <div className="form-field">
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows={5}
        required
      />
    </div>
  </div>

  <div className="form-column">
    <div className="form-field">
      <label htmlFor="dueDate">Due date</label>
      <input
        id="dueDate"
        name="dueDate"
        type="datetime-local"
        required
      />
    </div>

    <div className="form-field">
      <label htmlFor="topic">Topic</label>
      <input
        id="topic"
        name="topic"
        type="text"
        required
      />
    </div>
  </div>

  <button type="submit" className="create-task-button">
    Create task
  </button>
</form>
      </section>

      <section>
        <h2>Active tasks</h2>
        <form method="get" className="sort-form">
          <label htmlFor="sort">
            Sort tasks by
          </label>

          <select
            id="sort"
            name="sort"
            defaultValue={sort}
          >
            <option value="dueDate">
              Due date
            </option>
            <option value="topic">
              Topic
            </option>
            <option value="status">
              Status
            </option>
          </select>

          <button type="submit">
            Apply sort
          </button>
        </form>

        {activeTasks.length === 0 ? (
          <p>No active tasks.</p>
        ) : (
          <ul>
            {activeTasks.map((task) => {
              const overdue = isTaskOverdue(
                task.dueDate,
                task.status,
              );

              return (
                <li
                  key={task.id}
                  className={
                    overdue
                      ? "task-card task-card-overdue"
                      : "task-card"
                  }
                >
                  <h3>{task.title}</h3>

                  {overdue && (
                    <p className="overdue-badge">
                      Overdue
                    </p>
                  )}

                  <p>{task.description}</p>
                  <p>Topic: {task.topic}</p>
                  <p>
                    Status:{" "}
                    {formatStatus(task.status)}
                  </p>
                  <p>
                    Due:{" "}
                    {task.dueDate.toLocaleString()}
                  </p>

                  <details>
                    <summary>Edit task</summary>

                    <form action={updateTask}>
                      <input
                        type="hidden"
                        name="taskId"
                        value={task.id}
                      />

                      <div>
                        <label
                          htmlFor={`title-${task.id}`}
                        >
                          Title
                        </label>
                        <input
                          id={`title-${task.id}`}
                          name="title"
                          type="text"
                          defaultValue={task.title}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`description-${task.id}`}
                        >
                          Description
                        </label>
                        <textarea
                          id={`description-${task.id}`}
                          name="description"
                          defaultValue={
                            task.description
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`dueDate-${task.id}`}
                        >
                          Due date
                        </label>
                        <input
                          id={`dueDate-${task.id}`}
                          name="dueDate"
                          type="datetime-local"
                          defaultValue={formatDateTimeInput(
                            task.dueDate,
                          )}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`topic-${task.id}`}
                        >
                          Topic
                        </label>
                        <input
                          id={`topic-${task.id}`}
                          name="topic"
                          type="text"
                          defaultValue={task.topic}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`status-${task.id}`}
                        >
                          Status
                        </label>
                        <select
                          id={`status-${task.id}`}
                          name="status"
                          defaultValue={task.status}
                          required
                        >
                          <option value="TODO">
                            Todo
                          </option>
                          <option value="IN_PROGRESS">
                            In-Progress
                          </option>
                          <option value="COMPLETE">
                            Complete
                          </option>
                        </select>
                      </div>

                      <button type="submit">
                        Save changes
                      </button>
                    </form>
                  </details>

                  <form action={archiveTask}>
                    <input
                      type="hidden"
                      name="taskId"
                      value={task.id}
                    />
                    <button type="submit">
                      Archive task
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2>Archived tasks</h2>

        {archivedTasks.length === 0 ? (
          <p>No archived tasks.</p>
        ) : (
          <ul>
            {archivedTasks.map((task) => (
              <li
                key={task.id}
                className="task-card"
              >
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Topic: {task.topic}</p>
                <p>
                  Status:{" "}
                  {formatStatus(task.status)}
                </p>
                <p>
                  Due:{" "}
                  {task.dueDate.toLocaleString()}
                </p>
                <p>
                  Archived:{" "}
                  {task.archivedAt?.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}