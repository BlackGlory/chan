--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- mpmc资源本身是松散的, 没有自己的表

CREATE TABLE mpmc_json_schema (
  mpmc_id     VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE mpmc_blacklist (
  mpmc_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mpmc_whitelist (
  mpmc_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mpmc_tbac (
  token              VARCHAR(255) NOT NULL
, mpmc_id            VARCHAR(255) NOT NULL
, dequeue_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(dequeue_permission IN (0,1))
, enqueue_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(enqueue_permission IN (0,1))
, UNIQUE (token, mpmc_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE mpmc_json_schema;
DROP TABLE mpmc_blacklist;
DROP TABLE mpmc_whitelist;
DROP TABLE mpmc_tbac;
