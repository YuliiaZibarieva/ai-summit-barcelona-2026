import assert from "node:assert/strict";
import test from "node:test";
import { updateTaskTitle } from "./handlers.js";
import * as store from "./store.js";

function update(id, body) {
  const result = {};
  updateTaskTitle({}, {
    writeHead(status, headers) {
      result.status = status;
      assert.equal(headers["Content-Type"], "application/json");
    },
    end(body) { result.body = JSON.parse(body); },
  }, String(id), body);
  return result;
}

test("updates only the title and persists it in the store", () => {
  const task = store.add("original");
  task.done = true;
  const original = { ...task };
  const result = update(task.id, JSON.stringify({ title: "updated", done: false, id: 99 }));
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ...original, title: "updated" });
  assert.deepEqual(store.find(task.id), result.body);
});

test("accepts the 140-character limit", () => {
  const task = store.add("original");
  assert.equal(update(task.id, JSON.stringify({ title: "a".repeat(140) })).status, 200);
});

test("rejects invalid bodies without changing the task", () => {
  const task = store.add("original");
  for (const body of ["{", "", "null", "[]", "{}", '{"title":null}', '{"title":42}',
    '{"title":""}', '{"title":"   "}', JSON.stringify({ title: "a".repeat(141) })]) {
    assert.equal(update(task.id, body).status, 400, body);
    assert.equal(task.title, "original");
  }
});

test("returns 404 for a missing task", () => {
  assert.deepEqual(update(Number.MAX_SAFE_INTEGER, '{"title":"updated"}'), {
    status: 404, body: { error: "task not found" },
  });
});
