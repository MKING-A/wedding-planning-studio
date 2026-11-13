-- Execute ONCE in Cloudflare D1 > wedding-planner-db > Console > Execute.
-- No email, keys, tokens, or private guest data should be placed in this file.
CREATE TABLE IF NOT EXISTS shared_wedding (
  id TEXT PRIMARY KEY CHECK (id = 'main'),
  revision INTEGER NOT NULL CHECK (revision >= 1),
  plan_json TEXT NOT NULL,
  toronto_json TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
