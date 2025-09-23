/* migrated from database/migrations/2025_08_19_172738_create_personal_access_tokens_table.php */

export const SQL_UP = `
CREATE TABLE personal_access_tokens (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- For MySQL, use AUTO_INCREMENT
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index
    ON personal_access_tokens (tokenable_type, tokenable_id);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS personal_access_tokens;
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
  }
  else {
    console.warn(`db.query not found. Execute manually:\n`, SQL_DOWN);
  }
}

export default { up, down };