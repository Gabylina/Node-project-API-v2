/* migrated from database/migrations/2025_08_19_000000_create_projects_table.php */

export const SQL_UP = `
CREATE TABLE projects (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use AUTO_INCREMENT */
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_projects_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS projects;
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