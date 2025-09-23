// migrated from app/Models/User.php

/**
 * Represents a User entity.
 * This class is a clean data-focused entity, not an ORM model.
 * Persistence logic (e.g., saving to a database) should reside in a separate UserRepository.
 */
export class User {
  id;
  name;
  email;
  password; // Stored as a hashed string.
  emailVerifiedAt; // Date or null
  rememberToken; // String or null
  createdAt; // Date
  updatedAt; // Date

  // TODO: Add properties for any relationships here. For example, if a user has many posts:
  // posts; // Array of Post entities

  /**
   * Creates a new User instance.
   * @param {object} params - The user data.
   * @param {number} params.id - The unique identifier for the user.
   * @param {string} params.name - The user's full name.
   * @param {string} params.email - The user's email address (should be unique).
   * @param {string} params.password - The user's hashed password.
   * @param {Date|string|null} [params.emailVerifiedAt=null] - The timestamp when the email was verified.
   * @param {string|null} [params.rememberToken=null] - The "remember me" token.
   * @param {Date|string} [params.createdAt=new Date()] - The timestamp when the user was created.
   * @param {Date|string} [params.updatedAt=new Date()] - The timestamp when the user was last updated.
   */
  constructor({
    id,
    name,
    email,
    password,
    emailVerifiedAt = null,
    rememberToken = null,
    createdAt = new Date(),
    updatedAt = new Date(),
    // TODO: Include relationship data in constructor if desired for pre-loading.
    // posts = [],
  }) {
    if (id === undefined || name === undefined || email === undefined || password === undefined) {
      throw new Error('User constructor requires id, name, email, and password.');
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.emailVerifiedAt = emailVerifiedAt ? new Date(emailVerifiedAt) : null;
    this.rememberToken = rememberToken;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    // this.posts = posts; // Assign loaded relationship entities
  }

  /**
   * Creates a User instance from a plain object (e.g., from a database row).
   * Handles potential `snake_case` to `camelCase` conversion and type casting.
   * @param {object} obj - The plain object representing user data.
   * @returns {User|null} A new User instance, or null if obj is null/undefined.
   */
  static from(obj) {
    if (!obj) return null;
    return new User({
      id: obj.id,
      name: obj.name,
      email: obj.email,
      password: obj.password,
      // Handles both snake_case (DB) and camelCase (already processed object)
      emailVerifiedAt: obj.email_verified_at || obj.emailVerifiedAt,
      rememberToken: obj.remember_token || obj.rememberToken,
      createdAt: obj.created_at || obj.createdAt,
      updatedAt: obj.updated_at || obj.updatedAt,
      // TODO: Map relationship data if available in obj (e.g., obj.posts?.map(Post.from)).
    });
  }

  /**
   * Converts the User instance to a plain object, excluding 'hidden' attributes
   * and converting Date objects to ISO strings.
   * This mimics Laravel's `$hidden` property during serialization.
   * @returns {object} A plain object representation of the user.
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key) && !hiddenFields.includes(key)) {
        // Convert Date objects to ISO string for consistent JSON output
        if (this[key] instanceof Date) {
          data[key] = this[key].toISOString();
        } else {
          data[key] = this[key];
        }
      }
    }

    // TODO: If relationships are loaded, decide if they should be included in toJSON.
    // Example: if (this.posts) data.posts = this.posts.map(post => post.toJSON());

    return data;
  }

  // TODO: Add any domain-specific business methods here.
  // Example: hasPermission(permissionName), generateAuthToken().

  // --- Laravel Eloquent equivalents and their Node.js considerations ---

  // TODO: Repository Integration:
  // In Node.js, persistence logic typically resides in a separate Repository class.
  // This entity is purely for holding data and domain logic.
  // Example of how a service might use a User entity and a UserRepository:
  // class UserService {
  //   constructor(userRepository) { this.userRepository = userRepository; }
  //   async registerUser(userData) { /* const user = new User(...); await this.userRepository.save(user); */ }
  //   async getUserById(id) { /* return this.userRepository.findById(id); */ }
  // }

  // TODO: Relationships:
  // Relationships (e.g., User hasMany Posts) are typically handled by the repository
  // or a dedicated service, loading related entities explicitly. They can then be
  // attached to the User entity (e.g., user.posts = [...]).
  // There are no magic Eloquent methods (e.g., `user.posts()`) directly on the entity.

  // TODO: $fillable equivalent:
  // `protected $fillable = ['name', 'email', 'password'];`
  // In Node.js, mass assignment protection is handled explicitly at the application
  // layer (e.g., in controllers or services) by only passing allowed properties
  // to the constructor or the `from` method. The constructor enforces required fields.

  // TODO: $casts equivalent:
  // Laravel's `$casts` (e.g., `email_verified_at` as `datetime`) is handled by explicit
  // type conversions in the `constructor` and `static from` methods (e.g., `new Date()`).

  // TODO: Accessors and Mutators (e.g., `getNameAttribute`, `setPasswordAttribute`):
  // These are implemented as standard JavaScript getters and setters if needed.
  // Example:
  // get fullName() { return `${this.firstName} ${this.lastName}`; }
  // set newPassword(plainPassword) { this.password = hash(plainPassword); } // Hash password before setting
}


export default { User };