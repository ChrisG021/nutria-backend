import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('meal creation stores the local timestamp as text', async () => {
  const schema = await readFile(new URL('../prisma/schema.prisma', import.meta.url), 'utf8');
  const meals = schema.match(/model meals \{([\s\S]*?)\n\}/)?.[1];
  assert.match(meals, /created_at\s+String\b/);
});
