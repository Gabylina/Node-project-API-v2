// migrated from app/Models/Project.php

// TODO: If User or Task entities are also clean JS classes, import them here
// import { User } from './User.js';
// import { Task } from './Task.js';

export class Project {
  /** @type {number | null} */
  id;
  /** @type {string} */
  name;
  /** @type {string | null} */
  description;
  /** @type {number} */
  userId;
  /** @type {Date | null} */
  createdAt;
  /** @type {Date | null} */
  updatedAt;

  // TODO: Relationships are usually loaded by a repository, not the entity itself.
  // The entity holds the foreign key (userId) or an array of related IDs.
  // These properties are for when relationships are explicitly hydrated.
  /** @type {any | null} */ // Use 'User' class if imported
  owner;
  /** @type {any[]} */    // Use 'Task[]' if imported
  tasks;

  /**
   * Creates a Project instance.
   * @param {object} props - Properties to initialize the Project.
   * @param {number | null} [props.id=null]
   * @param {string} props.name
   * @param {string | null} [props.description=null]
   * @param {number} props.userId
   * @param {Date | string | null} [props.createdAt=null]
   * @param {Date | string | null} [props.updatedAt=null]
   * @param {any | null} [props.owner=null] - Hydrated owner object/entity
   * @param {any[]} [props.tasks=[]] - Hydrated tasks array/entities
   */
  constructor({ id = null, name, description = null, userId, createdAt = null, updatedAt = null, owner = null, tasks = [] }) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Project name is required.');
    }
    if (typeof userId !== 'number' || !Number.isInteger(userId)) {
      throw new Error('Project userId must be an integer.');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.createdAt = createdAt instanceof Date ? createdAt : (createdAt ? new Date(createdAt) : null);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : (updatedAt ? new Date(updatedAt) : null);
    this.owner = owner;
    this.tasks = tasks;
  }

  /**
   * Creates a Project instance from a plain object (e.g., from database or API input).
   * Mimics aspects of Laravel's model hydration.
   * @param {object} obj - The plain object data.
   * @returns {Project}
   */
  static from(obj) {
    // TODO: $fillable - In a clean entity, all properties are usually settable.
    // If you need to restrict which fields can be set from external input (like `$fillable`),
    // implement validation/sanitization logic here or in a dedicated DTO/validator before calling `from`.
    // Example: only allow 'name', 'description', 'user_id' from an API request body for creation.

    if (!obj || typeof obj !== 'object') {
      throw new Error('Invalid object provided to Project.from');
    }

    const data = {
      id: obj.id ?? null,
      name: obj.name,
      description: obj.description ?? null,
      userId: obj.user_id ?? obj.userId, // Support both 'user_id' (DB) and 'userId' (JS convention)
      createdAt: obj.created_at ?? obj.createdAt ?? null,
      updatedAt: obj.updated_at ?? obj.updatedAt ?? null,
    };

    // TODO: $casts - Laravel automatically casts types. Here, we do it explicitly.
    // Dates are handled above. For other types (e.g., booleans, JSON objects),
    // add explicit conversion logic here if needed based on input format.

    const project = new Project(data);

    // Handle hydrated relationships if present in the input object.
    // A repository would typically perform this hydration.
    if (obj.owner) {
      // project.owner = User.from(obj.owner); // If User class exists
      project.owner = obj.owner; // Otherwise, assign as plain object
    }
    if (obj.tasks && Array.isArray(obj.tasks)) {
      // project.tasks = obj.tasks.map(taskData => Task.from(taskData)); // If Task class exists
      project.tasks = obj.tasks; // Otherwise, assign as plain objects
    }

    return project;
  }

  /**
   * Returns a plain object representation of the Project instance.
   * Useful for API responses or database storage.
   * @returns {object}
   */
  toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

    // Include hydrated relationships if they exist and have a toJSON method
    if (this.owner) {
      json.owner = typeof this.owner.toJSON === 'function' ? this.owner.toJSON() : this.owner;
    }
    if (this.tasks && Array.isArray(this.tasks) && this.tasks.length > 0) {
      json.tasks = this.tasks.map(task => typeof task.toJSON === 'function' ? task.toJSON() : task);
    }

    return json;
  }

  // TODO: Add methods for business logic related to a Project entity.
  // Example: assignTask(task: Task), completeProject(), etc.
}


export default { Project };