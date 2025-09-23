/* migrated from database/migrations/0001_01_01_000001_create_cache_table.php */

export const SQL_UP = `
-- Create 'cache' table
CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT, /* Laravel's mediumText typically maps to TEXT in most databases. Consider MEDIUMTEXT for MySQL if a larger column is strictly required. */
    expiration INTEGER
);

-- Create 'cache_locks' table
CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255),
    expiration INTEGER
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS cache_locks;
DROP TABLE IF EXISTS cache;
`;

export async function up(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn(`db.query not found. Execute manually:\n`, SQL_UP);
  }
}

export async function down(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn(`db.query not found. Execute manually:\n`, SQL_DOWN);
  }
}

export default { up, down };
