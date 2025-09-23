/* migrated from database/factories/UserFactory.php */

/**
 * @typedef {Object} UserDeps
 * @property {object} [userRepo] - Repository for User model persistence.
 */

export class UserFactory {
  /**
   * Private static field to cache the default password hash, mimicking PHP's `protected static ?string $password;`.
   * This ensures the default password is "hashed" (or assigned its placeholder) only once per process/application lifecycle
   * if not explicitly overridden by factory consumers, similar to how Laravel's factory handles static properties for consistency.
   */
  static #_cachedPasswordHash = null;

  /**
   * Define the model's default state.
   *
   * @param {UserDeps} deps - Optional dependencies (e.g., repositories, config).
   * @returns {Object} A plain object representing the default attributes of a User.
   */
  static definition(deps = {}) {
    if (!UserFactory.#_cachedPasswordHash) {
      // Mimics PHP's `static::$password ??= Hash::make('password')`.
      // In a real application, you would integrate an actual password hashing library here (e.g., bcrypt, Argon2).
      UserFactory.#_cachedPasswordHash = 'hashed_password_for_default'; // TODO: integrate actual password hashing
    }

    return {
      name: 'John Doe', // TODO: integrate Faker of Node (e.g. @faker-js/faker) for realistic names
      email: 'john.doe@example.com', // TODO: integrate Faker of Node (e.g. @faker-js/faker) for unique and safe emails
      email_verified_at: new Date().toISOString(), // Equivalent to Laravel's `now()` for an ISO 8601 timestamp
      password: UserFactory.#_cachedPasswordHash,
      remember_token: 'AAAAAAAAAA', // TODO: generate actual random string of 10 characters
    };
  }

  /**
   * Create a User object with default attributes, merged with any overrides.
   * This method does not persist the record to a database.
   *
   * @param {Object} overrides - Attributes to override the default definition.
   * @param {UserDeps} deps - Optional dependencies.
   * @returns {Object} A plain object representing a User record.
   */
  static make(overrides = {}, deps = {}) {
    return {
      ...this.definition(deps),
      ...overrides,
    };
  }

  /**
   * Create a User object and, if a repository is provided in `deps`, persist it.
   *
   * @param {Object} overrides - Attributes to override the default definition.
   * @param {UserDeps} deps - Optional dependencies (e.g., repositories, config).
   * @returns {Promise<Object>} A promise that resolves to the created User record (potentially after persistence).
   */
  static async create(overrides = {}, deps = {}) {
    const record = this.make(overrides, deps);
    // TODO: persist via repository if exists, e.g., deps.userRepo?.create(record)
    // Example: if (deps.userRepo) { await deps.userRepo.create(record); }
    return record;
  }
}
