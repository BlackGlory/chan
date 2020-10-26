--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- mpmc资源本身是松散的, 无需专门创建表

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
, dequeue_permission BOOLEAN      NOT NULL CHECK(dequeue_permission IN (0,1))
, enqueue_permission BOOLEAN      NOT NULL CHECK(enqueue_permission IN (0,1))
, UNIQUE (token, mpmc_id)
);

CREATE TRIGGER auto_delete_after_insert_mpmc_tbac
 AFTER INSERT ON mpmc_tbac
  WHEN NEW.dequeue_permission = 0
   AND NEW.enqueue_permission = 0
BEGIN
  DELETE FROM mpmc_tbac
   WHERE mpmc_tbac.token = NEW.token AND mpmc_tbac.mpmc_id = NEW.mpmc_id;
END;

CREATE TRIGGER auto_delete_after_update_mpmc_tbac
 AFTER UPDATE ON mpmc_tbac
  WHEN NEW.dequeue_permission = 0
   AND NEW.enqueue_permission = 0
BEGIN
  DELETE FROM mpmc_tbac
   WHERE mpmc_tbac.token = NEW.token AND mpmc_tbac.mpmc_id = NEW.mpmc_id;
END;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE mpmc_json_schema;
DROP TABLE mpmc_blacklist;
DROP TABLE mpmc_whitelist;
DROP TABLE mpmc_tbac;
