# FieldSync — Server

This is the backend for FieldSync. It's the part that handles login, stores all the data, and powers both the admin dashboard and the technician app.



---

## What it does

In simple terms, the server:

- **Stores all the data** — users, jobs, and notifications live in a MongoDB database that this server talks to.
- **Handles login** — when an admin or technician logs in, this server checks their password and gives them back a token that proves who they are.
- **Runs the business rules** — like "only admins can create jobs" or "a technician can only see their own jobs."
- **Sends notifications** — when a job status changes, this server emails the client.

The frontend (the React app in `client/`) doesn't do any of this — it just asks the server to do it. The frontend is the dining area, the server is the kitchen.

---

## Before you start

You need a few things installed on your machine:

1. **Node.js** (version 20 or higher). Download it from [nodejs.org](https://nodejs.org). To check if you already have it, open a terminal and run:
   ```bash
   node --version
   ```
2. **A code editor**. VS Code is the team standard.
3. **The project cloned** from GitHub onto your computer.

You also need the team's `.env` file values — ask whoever set up the project to share the MongoDB connection string with you securely.

---

## First-time setup

Do this once, the very first time you pull the project.

### 1. Open a terminal in the `server` folder

```bash
cd server
```

### 2. Install the dependencies

```bash
npm install
```

This downloads all the libraries the server needs (Express, Mongoose, etc.) into a `node_modules` folder. It might take a minute or two. You only need to do this once — or again whenever the team adds new libraries.

### 3. Create your `.env` file

There's a file called `.env.example` in the `server` folder. It lists every variable you need, but with placeholder values.

Copy it and name the copy `.env`:

```bash
cp .env.example .env
```

(On Windows, you can just duplicate the file in your file explorer and rename it.)

Then open `.env` in your editor and fill in the real values. The most important one is `MONGODB_URI` — get this from the project lead.

> **Important:** Never commit `.env` to Git. It contains secrets (database passwords, JWT signing keys). It's already in `.gitignore`, so as long as you don't force it, you'll be fine.

---

## Starting the server

Once you've done the first-time setup, this is the only command you need:

```bash
npm start
```

You should see something like this:

```
MongoDB connected: ac-xxxxxx-shard-00-02.abc123.mongodb.net
Server running on http://localhost:4000
```

That's it — the server is running. **Leave the terminal open.** The server stays alive until you close the terminal or press `Ctrl+C`.

### How to know it's working

Open your browser and visit:

```
http://localhost:4000/health
```

If you see something like `{"ok":true,"message":"FieldSync API is live and healthy"}` then the server is alive and well. This is called a "health check" — it's a tiny test endpoint that says "yes, I'm running."

---

## Stopping the server

In the terminal where the server is running, press `Ctrl + C`. That kills the process. You're done.

---

## If something goes wrong

Some common things and how to fix them:

| Message | What it means | What to do |
|---|---|---|
| `MongoDB connection error: bad auth` | Wrong password in your `.env` | Double-check the `MONGODB_URI` matches what was shared with you |
| `MongoDB connection error: ENOTFOUND` | Network or typo in the URI | Check your internet, then check the URI for typos |
| `Error: listen EADDRINUSE :::4000` | Something else is already using port 4000 | Either close the other program or change `PORT` in your `.env` |
| `Cannot find module 'express'` | Dependencies aren't installed | Run `npm install` |
| Server starts then immediately quits | Usually a database connection problem | Look at the error message just above the exit |

If you're stuck, drop the error message in the team chat — odds are someone else hit the same thing.

---

## What's inside this folder

A quick map, in case you're curious:

```
server/
├── .env             ← your secrets (not in Git)
├── .env.example     ← list of variables you need
├── package.json     ← list of libraries this server uses
└── src/
    ├── index.js     ← the entry point — this is what runs first
    ├── config/      ← setup code (e.g. database connection)
    ├── models/      ← shapes of the data we store
    ├── graphql/     ← the API itself (what the frontend calls)
    ├── middleware/  ← security checks that run before each request
    ├── services/    ← helpers like sending emails
    └── utils/       ← small utility functions
```

You don't need to understand all of this to use the server — but if you're curious, `index.js` is a good place to start reading.

---

## A note for frontend folks

If you're only working on the React app, you don't need to know how this server works internally. You just need it **running** in a separate terminal while you work on the frontend, so your React app can talk to it.

The flow is:
1. Open one terminal → `cd server` → `npm start`. Leave it running.
2. Open a second terminal → `cd client` → `npm run dev`. That starts the React app.
3. Both run side by side. Your React app sends requests to `http://localhost:4000`, the server responds.

That's all. Happy building.
