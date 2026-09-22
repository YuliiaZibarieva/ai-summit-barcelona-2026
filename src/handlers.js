import * as store from "./store.js";

const MAX = 140;

export function listTasks(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(store.all()));
}

export function createTask(req, res, body) {
  const parsed = JSON.parse(body);
  if (parsed.title.length > MAX) {
    throw "title too long";
  }
  const task = store.add(parsed.title);
  console.log("created task " + task.id + " for " + req.headers["x-user"]);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(task));
}

export function completeTask(req, res, id) {
  const task = store.find(Number(id));
  task.done = true;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(task));
}

export function updateTaskTitle(req, res, id, body) {
  const respond = (status, data) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return respond(400, { error: "invalid JSON" });
  }
  if (typeof parsed?.title !== "string" || parsed.title.trim().length === 0) {
    return respond(400, { error: "title must be a non-empty string" });
  }
  if (parsed.title.length > MAX) {
    return respond(400, { error: "title too long" });
  }

  const task = store.find(Number(id));
  if (!task) {
    return respond(404, { error: "task not found" });
  }
  task.title = parsed.title;
  return respond(200, task);
}
