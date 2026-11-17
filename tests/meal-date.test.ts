import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMealDate } from "../src/lib/meal-date";

test("formats the current instant in Teresina time", () => {
  assert.equal(formatMealDate(new Date("2026-11-16T12:57:30.297Z")), "2026-11-16T09:57:30.297-03:00");
});

test("uses the previous calendar day when necessary", () => {
  assert.equal(formatMealDate(new Date("2026-11-16T01:00:00.000Z")), "2026-11-15T22:00:00.000-03:00");
});
