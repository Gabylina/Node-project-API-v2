/* migrated from database/migrations/0001_01_01_000000_create_users_table.php */

export const SQL_UP = `
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: Use AUTO_INCREMENT for MySQL */
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL, /* TODO: Consider LONGTEXT for MySQL if TEXT is insufficient */
    last_activity INT NOT NULL
);

CREATE INDEX sessions_user_id_index ON sessions (user_id);
CREATE INDEX sessions_last_activity_index ON sessions (last_activity);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;
`;

export async function up(db, deps = {}) {
  if (db?.query) await db.query(SQL_UP);
  else console.warn(`db.query not found. Execute manually:\n`, SQL_UP);
}

export async function down(db, deps = {}) {
  if (db?.query) await db.query(SQL_DOWN);
  else console.warn(`db.query not found. Execute manually:\n`, SQL_DOWN);
}

export default { up, down };
