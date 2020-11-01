import { getDatabase } from './database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT chan_id FROM chan_blacklist;
  `).all()
  return result.map(x => x['chan_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_blacklist
              WHERE chan_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })
  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO chan_blacklist (chan_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM chan_blacklist
     WHERE chan_id = $id;
  `).run({ id })
}
