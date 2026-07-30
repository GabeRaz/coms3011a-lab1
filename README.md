## Running It

### Requirements

- Node.js `v24.14.1`
- npm `11.11.0`
- Git

### 1. Clone the repository

```bash
git clone https://github.com/GabeRaz/coms3011a-lab1
cd coms3011a-lab1
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS or Linux:

```bash
cp .env.example .env
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Create the SQLite database

```bash
npx prisma migrate deploy
```

### 6. Run the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Stop the application using `Ctrl + C`.

### 7. Run the automated tests

```bash
npm test
```

### Additional checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```