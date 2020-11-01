--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- chan资源本身是松散的, 没有自己的表

CREATE TABLE chan_json_schema (
  chan_id     VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE chan_blacklist (
  chan_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE chan_whitelist (
  chan_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE chan_tbac (
  token              VARCHAR(255) NOT NULL
, chan_id            VARCHAR(255) NOT NULL
, read_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, UNIQUE (token, chan_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE chan_json_schema;
DROP TABLE chan_blacklist;
DROP TABLE chan_whitelist;
DROP TABLE chan_tbac;
