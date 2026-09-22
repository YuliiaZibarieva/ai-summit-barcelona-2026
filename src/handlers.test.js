import assert from "node:assert/strict";
import test from "node:test";
import { updateTaskTitle } from "./handlers.js";
import * as store from "./store.js";

function update(id, body) {
  const response = {};
  updateTaskTitle({}, {
    writeHead(status, headers) {
      response.status = status;
      response.headers = headers;
    },
    end(value) {
      response.body = JSON.parse(value);
    },
  }, String(id), body);
  return response;
}

test("updates and persists only the title, including the maximum length", () => {
  const task = store.add("original");
  task.done = true;
  const original = { ...task };
  const title = "a".repeat(140);
  const response = update(task.id, JSON.stringify({ title, done: false, id: 999 }));
  assert.equal(response.status, 200);
  assert.equal(response.headers["Content-Type"], "application/json");
  assert.deepEqual(response.body, { ...original, title });
  assert.deepEqual(store.find(task.id), { ...original, title });
});

test("rejects invalid bodies without changing the task", () => {
  const task = store.add("unchanged");
  const original = { ...task };
  for (const body of ["", "{", "null", "[]", "{}", '"title"',
    ...[null, 123, false, [], {}, "", "   ", "a".repeat(141)].map(title => JSON.stringify({ title }))]) {
    const response = update(task.id, body);
    assert.equal(response.status, 400, body);
    assert.equal(typeof response.body.error, "string");
    assert.deepEqual(store.find(task.id), original);
  }
});

test("rejects malformed task IDs", () => {
  for (const id of ["abc", "0", "-1", "1.5", "1e0", "9007199254740992"]) {
    assert.equal(update(id, '{"title":"new title"}').status, 400);
  }
});

test("returns 404 for a task that does not exist", () => {
  assert.deepEqual(update(999999, '{"title":"new title"}').body, { error: "task not found" });
  assert.equal(update(999999, '{"title":"new title"}').status, 404);
});
