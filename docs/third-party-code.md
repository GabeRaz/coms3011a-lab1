# Third-Party Code

## 1. Purpose

This document records the third-party software, generated code, templates and external assistance used in the development of the COMS3011A Lab 1 todo application.

Exact dependency versions are recorded in `package.json` and locked in `package-lock.json`. This document explains why each dependency is present rather than duplicating the lock file.

## 2. Application Dependencies

The following packages are required when the application runs.

| Package | Purpose in the application |
|---|---|
| `next` | Provides the full-stack application framework, including routing, server-rendered pages, Server Actions, development tooling and production builds. |
| `react` | Provides the component model used to construct the user interface. |
| `react-dom` | Integrates React with the browser DOM and is used by Next.js to render the interface. |
| `@prisma/client` | Provides the generated, type-safe client used by the application to create, read and update task records. |
| `@prisma/adapter-better-sqlite3` | Connects Prisma Client to the local SQLite database through the Better SQLite3 driver. |
| `dotenv` | Loads the local database connection string from the `.env` file where required by the Prisma configuration. |

## 3. Development Dependencies

The following packages support development, database generation, testing, type checking and code-quality checks.

| Package | Purpose in the project |
|---|---|
| `prisma` | Defines and validates the database schema, generates Prisma Client and creates or applies database migrations. |
| `typescript` | Provides static type checking for the application and test code. |
| `vitest` | Runs the automated unit and database tests through the project's test command. |
| `better-sqlite3` | Provides direct SQLite access used by the database test setup. |
| `eslint` | Checks the source code for syntax, TypeScript and code-quality problems. |
| `eslint-config-next` | Supplies ESLint rules recommended for Next.js projects. |
| `@types/node` | Provides TypeScript declarations for Node.js APIs. |
| `@types/react` | Provides TypeScript declarations for React. |
| `@types/react-dom` | Provides TypeScript declarations for React DOM. |
| `@types/better-sqlite3` | Provides TypeScript declarations for the Better SQLite3 package. |

Only direct dependencies declared by the project are listed above. Indirect or transitive dependencies installed by npm are recorded automatically in `package-lock.json` and are not individually described here.

## 4. Framework Template and Boilerplate

The repository was initially created using the standard Next.js project generator.

The generator supplied the initial project structure and configuration files, including the basic Next.js application layout, TypeScript configuration, ESLint configuration and npm scripts. The default demonstration page and styling were replaced or modified to implement the required todo application.

This generated starting structure is third-party boilerplate supplied by the Next.js project tooling rather than original application logic.

## 5. Prisma-Generated Code

Prisma generates code and migration artefacts from the project's Prisma schema.

Generated material includes:

- Prisma Client files under `src/generated/prisma/`
- SQL migration files under `prisma/migrations/`
- Migration metadata used by Prisma

The generated Prisma Client should not be edited manually. Changes to the database model are made in `prisma/schema.prisma`, after which Prisma regenerates the required client and migration artefacts.

The database schema and the application's use of the generated client were written specifically for this project.

## 6. AI-Assisted Development

ChatGPT was used as a development assistant during the project.

Assistance included:

- Interpreting the laboratory requirements
- Explaining the Next.js, TypeScript, Prisma and SQLite project structure
- Suggesting implementation steps and code snippets
- Assisting with the task schema, task actions and database queries
- Assisting with sorting, archiving and overdue-task behaviour
- Suggesting automated tests
- Assisting with debugging, Git commands and project documentation

The suggested material was incorporated, adapted and reviewed within the project. The final implementation was validated locally using the project's automated tests, ESLint checks and production build.

The development record supplied for this documentation does not identify code copied directly from any additional tutorial, public repository or question-and-answer website.

## 7. Project-Specific Code

The following parts of the application are project-specific rather than unmodified third-party code:

- The Task database model and fixed `TaskStatus` values
- Task creation, editing and archiving behaviour
- Active and archived task queries
- Topic, status and due-date sorting
- Overdue-task calculation
- Application layout and styling
- Automated task-rule and database tests
- Project documentation

These parts use third-party frameworks and libraries, but their configuration and application logic are specific to this project.

## 8. Verification

The direct dependency list can be checked with:

```bash
npm ls --depth=0
```

The project can be verified using:

```bash
npm test
npm run lint
npm run build
```

The exact installed dependency tree is recorded in:

```
package-lock.json
```