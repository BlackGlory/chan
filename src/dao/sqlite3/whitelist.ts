import { getDatabase } from './database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT mpmc_id FROM mpmc_whitelist;
  `).all()
  return result.map(x => x['mpmc_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_whitelist
              WHERE mpmc_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })
  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO mpmc_whitelist (mpmc_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM mpmc_whitelist
     WHERE mpmc_id = $id;
  `).run({ id })
}
