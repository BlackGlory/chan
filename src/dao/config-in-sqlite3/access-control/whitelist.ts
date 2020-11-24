import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT chan_id FROM chan_whitelist;
  `).all()
  return result.map(x => x['chan_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_whitelist
              WHERE chan_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })
  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO chan_whitelist (chan_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM chan_whitelist
     WHERE chan_id = $id;
  `).run({ id })
}
