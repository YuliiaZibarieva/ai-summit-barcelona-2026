# When code is cheap, governance is the hard part

Workshop 2, AI Foundations track, AI Summit Barcelona 2026.
Tuesday 22 September, 10:00 to 11:20, Workshop Room B.

This repository is the workshop. Everything you need is here: the demo service you will change, the six tasks, and copy-paste examples for every file you have to write.

**Level:** practitioner. **Format:** hands on, from minute five.

---

## Start here, before the session begins

If you are reading this in the room, do these four steps now, in this order. You will be typing by 10:05.

### 1. Fork this repository

Go to [github.com/qualityclouds/ai-summit-barcelona-2026](https://github.com/qualityclouds/ai-summit-barcelona-2026) and click **Fork**. **Leave "Copy the DEFAULT branch only" unchecked.** Tasks 3, 4 and 5 each have a catch-up branch that lets you rejoin if you fall behind, and ticking that box leaves all of them out of your fork.

You now have your own copy at `github.com/YOUR-USERNAME/ai-summit-barcelona-2026`. Everything you write today is yours to keep.

### 2. Clone your fork

Swap in your own username. If the URL still says `qualityclouds`, you are cloning the wrong repository:

```bash
git clone https://github.com/YOUR-USERNAME/ai-summit-barcelona-2026.git
cd ai-summit-barcelona-2026
node src/server.js
```

No install step. The demo service has zero dependencies and runs on Node alone, so conference wifi cannot break your setup.

Do not add an `upstream` remote. You never need one today, and it breaks `git switch` on the catch-up branches.

<details>
<summary>Prefer the <code>gh</code> CLI?</summary>

```bash
gh repo fork qualityclouds/ai-summit-barcelona-2026 --clone
cd ai-summit-barcelona-2026
git config checkout.defaultRemote origin
```

`gh` copies every branch and adds an `upstream` remote for you. That third line is what stops the extra remote from making the catch-up branch names ambiguous.

</details>

### 3. Open the folder in your AI coding tool

### 4. Create your free Norma account

If you have not already. [Steps below](#create-your-norma-account), two minutes. Leave the browser window open: Norma's MCP server authorizes over OAuth in Task 3.

## Create your Norma account

Do this before you travel if you can. It takes two minutes, it needs working wifi, and it is the one prerequisite that is awkward to fix from your seat.

1. Go to [norma.qualityclouds.com](https://norma.qualityclouds.com) and click **Sign up**.
2. Sign up with GitHub or Bitbucket in one click. That shares your profile and repository metadata, and your code is never stored. If you would rather not connect an account, use the email form: first name, last name, email, password.
3. That is it. No credit card, and Norma needs no repository access to create the account.

The free plan is permanent, not a trial, and it covers everything this workshop asks of it.

**Signing up on the day?** Do it during Task 0, while there is slack in the schedule. Task 3 assumes you already have an account and a browser you are logged into.

## What you need

| | |
|---|---|
| **Your tool** | Claude Code, Cursor, Codex, Windsurf, Replit, or any client that speaks MCP. Signed in and working. |
| **Your machine** | Git, Node 20 or later, a terminal you know, a laptop. |
| **Your accounts** | A GitHub account and a free Norma workspace. No API key: Norma's MCP server uses OAuth. |

If your tool has no MCP support, pair up with someone whose does. Tasks 0 to 2 work on any tool.

## What you leave with

A working repository in your own GitHub account, the configuration that made it work, and a reusable skill you can drop into your own projects on Monday.

---

## The tasks

Work through them in order. Each one takes the time listed and stands alone, so if you fall behind you can skip ahead.

| | Task | Time |
|---|---|---|
| 0 | [Setup check](tasks/task-0-setup-check.md) | 5 min |
| 1 | [The naked loop](tasks/task-1-naked-loop.md) | 8 min |
| 2 | [The context layer](tasks/task-2-context-layer.md) | 10 min |
| 3 | [Configure Norma](tasks/task-3-configure-norma.md) | 13 min |
| 4 | [Close the loop](tasks/task-4-close-the-loop.md) | 12 min |
| 5 | [Package it as a skill](tasks/task-5-package-a-skill.md) | 10 min |

### Commit as you go

Tasks 1, 2, 4 and 5 end with a commit. It takes five seconds and it is what makes the comparison in Task 2 possible: you diff Task 1's answer against Task 2's answer directly, instead of trying to remember what the first one looked like.

You stay on `main` unless you fall behind and pick up a catch-up branch. Nothing to lose when your agent leaves the working tree dirty.

### If you fall behind

Tasks 3, 4 and 5 each have a branch holding the finished state of the task before it. Commit or stash anything you want to keep, then switch:

```bash
git switch task-3-start   # the repository at the end of Task 2
git switch task-4-start   # same state: Task 3 changes no code
git switch task-5-start   # the repository at the end of Task 4
```

Your own work stays on `main`, and `git switch main` brings you back to it.

Two things that can go wrong:

- **`invalid reference: task-3-start`** means your fork copied only the main branch. Fork it again with **"Copy the DEFAULT branch only" unchecked**.
- **`matched multiple (2) remote tracking branches`** means you added a second remote. Be explicit about which one you want: `git switch --track origin/task-3-start`.

## Copy-paste examples

Everything the tasks ask you to write, already written:

- [`examples/AGENTS.md`](examples/AGENTS.md) - the context file for Task 2
- [`examples/mcp-config.md`](examples/mcp-config.md) - Norma MCP setup for each tool, for Task 3
- [`examples/check-and-fix/SKILL.md`](examples/check-and-fix/SKILL.md) - the skill for Task 5

## The demo service

`src/` holds a small HTTP API for a task list. It works. It is also full of the things a code review would catch, which is the point: you are going to ask an agent to extend it, and then find out whether you can defend what comes back.

```
src/server.js     HTTP server and routing
src/handlers.js   request handlers
src/store.js      in-memory data store
```

Run it with `node src/server.js` and it listens on port 3000.

```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -d '{"title":"write the talk"}'
curl -X PATCH http://localhost:3000/tasks/1 -H 'Content-Type: application/json' -d '{"title":"update the talk"}'
```

`PATCH /tasks/:id` updates a task's title and returns the updated task with status 200.
Titles must be non-empty strings of at most 140 characters. Invalid JSON or titles
return 400; a missing task returns 404. Other task fields are preserved.

Run the tests with `npm test`.

---

## After the workshop

- Norma's free tier is permanent, not a trial: one certificate a month, and [the plans](https://qualityclouds.ai/pricing/norma) are there if you outgrow it. Point it at your own repository: [norma.qualityclouds.com](https://norma.qualityclouds.com)
- Once you are in a repository you own, link it so checks and findings are attributed to it. Ask your agent:

  ```
  Link this repository to my Norma workspace.
  ```

  Linking resolves your git remote against the repositories in your Norma organization, so it works on your own repositories, not on a clone of someone else's. It is also what makes step 7 of the skill work: the audit record binds to a repository, so it has nothing to bind to until you link one.
- The Norma GitHub App reviews pull requests, so code that never went through an agent loop still gets checked: [github.com/apps/norma-by-quality-clouds](https://github.com/apps/norma-by-quality-clouds)
- Norma MCP endpoint, if you are wiring it up yourself: `https://api.qualityclouds.ai/mcp`

## HackBarna, 19 and 20 September

The Quality Clouds challenge track at HackBarna runs on the same idea: **Production Ready: ship AI code you can defend.** Norrsken House Barcelona. Come and find us at the pod.

---

Questions during the session: wave, there are mentors in the room.
Questions afterwards: [qualityclouds.ai](https://qualityclouds.ai)
