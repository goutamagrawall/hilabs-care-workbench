CREATE TABLE visitor_state (
  visitor_key TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL,
  payload TEXT NOT NULL
);
