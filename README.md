# TODO App

A full-stack TODO application built with React, Express, Prisma and PostgreSQL.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + TanStack Query
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Database:** PostgreSQL (via Docker)
- **Auth:** JWT + bcrypt

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/) - `npm install -g pnpm`

### 1. Start the database

```bash
docker compose up -d
```

### 2. Setup backend

```bash
cd backend
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

### 3. Setup frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.
