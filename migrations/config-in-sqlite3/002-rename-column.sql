--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE chan_blacklist
RENAME COLUMN chan_id TO namespace;

ALTER TABLE chan_whitelist
RENAME COLUMN chan_id TO namespace;

ALTER TABLE chan_token_policy
RENAME COLUMN chan_id TO namespace;

ALTER TABLE chan_token
RENAME COLUMN chan_id TO namespace;

ALTER TABLE chan_json_schema
RENAME COLUMN chan_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE chan_blacklist
RENAME COLUMN namespace TO chan_id;

ALTER TABLE chan_whitelist
RENAME COLUMN namespace TO chan_id;

ALTER TABLE chan_token_policy
RENAME COLUMN namespace TO chan_id;

ALTER TABLE chan_token
RENAME COLUMN namespace TO chan_id;

ALTER TABLE chan_json_schema
RENAME COLUMN namespace TO chan_id;
