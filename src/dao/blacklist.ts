import { getDatabase } from './database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT mpmc_id FROM mpmc_blacklist
  `).all()
  return result.map(x => x['mpmc_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_blacklist
              WHERE mpmc_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })
  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string): void {
  getDatabase().prepare(`
    INSERT INTO mpmc_blacklist (mpmc_id)
    VALUES ($id);
  `).run({ id })
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM mpmc_blacklist
     WHERE mpmc_id = $id;
  `).run({ id })
}
