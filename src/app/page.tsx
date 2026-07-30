import { createTask } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <h1>Todo Application</h1>

      <section>
        <h2>Create a task</h2>

        <form action={createTask}>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" required />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" required />
          </div>

          <div>
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              required
            />
          </div>

          <div>
            <label htmlFor="topic">Topic</label>
            <input id="topic" name="topic" type="text" required />
          </div>

          <button type="submit">Create task</button>
        </form>
      </section>

      <section>
        <h2>Active tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks have been created.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Topic: {task.topic}</p>
                <p>Status: {task.status}</p>
                <p>Due: {task.dueDate.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}