// migrated from app/Models/Task.php

/**
 * @typedef {string|number} TaskStatus // TODO: Adjust based on actual TaskStatus enum implementation (string, number, or custom object).
 * For example:
 * export const TaskStatus = {
 *   PENDING: 'pending',
 *   IN_PROGRESS: 'in_progress',
 *   COMPLETED: 'completed',
 *   // ...
 * };
 */

export class Task {
    // Core attributes derived from $fillable and common Laravel model fields.
    id;
    projectId; // Corresponds to 'project_id'
    title;
    description;
    /** @type {TaskStatus} */
    status; // TODO: This field was cast to TaskStatus in Laravel. Handle casting/type validation if needed.
    assignedTo; // Corresponds to 'assigned_to'
    createdAt; // Standard Laravel timestamp
    updatedAt; // Standard Laravel timestamp

    /**
     * @param {object} properties
     * @param {number} [properties.id] - The unique identifier for the task.
     * @param {number} properties.projectId - The ID of the associated project.
     * @param {string} properties.title - The title of the task.
     * @param {string} [properties.description] - The description of the task.
     * @param {TaskStatus} properties.status - The current status of the task.
     * @param {number} [properties.assignedTo] - The ID of the user assigned to the task.
     * @param {Date|string} [properties.createdAt] - The creation timestamp.
     * @param {Date|string} [properties.updatedAt] - The last update timestamp.
     */
    constructor({ id, projectId, title, description, status, assignedTo, createdAt, updatedAt }) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        // TODO: Apply casting logic for `status` if `TaskStatus` is a class/enum instance.
        // Example: this.status = (status instanceof TaskStatus) ? status : TaskStatus.fromValue(status);
        this.status = status;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt ? new Date(createdAt) : undefined;
        this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
    }

    /**
     * Creates a Task instance from a plain object (e.g., from a database row or API response).
     * @param {object} obj - The plain object containing task properties.
     * @returns {Task}
     */
    static from(obj) {
        if (!obj) {
            // TODO: Decide whether to return null, throw an error, or return an empty Task instance
            return null;
        }

        // TODO: Handle potential type conversions.
        // For example, if `obj.status` is a raw string/number and `this.status` expects a TaskStatus enum instance.
        // For date fields like `created_at` and `updated_at`, convert to Date objects if they are strings.
        return new Task({
            id: obj.id,
            projectId: obj.project_id, // Laravel database columns typically use snake_case
            title: obj.title,
            description: obj.description,
            status: obj.status, // TODO: Apply casting for TaskStatus (e.g., TaskStatus.fromValue(obj.status))
            assignedTo: obj.assigned_to,
            createdAt: obj.created_at,
            updatedAt: obj.updated_at,
        });
    }

    /**
     * Converts the Task instance to a plain object, suitable for JSON serialization or persistence.
     * @returns {object}
     */
    toJSON() {
  const { password, remember_token, ...data } = this;
  if (data.created_at instanceof Date) data.created_at = data.created_at.toISOString();
  if (data.updated_at instanceof Date) data.updated_at = data.updated_at.toISOString();
  return data;
};

        // Remove undefined values for cleaner output
        return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
    }

    // TODO: Repository integration for persistence
    // In a "no-ORM" setup, persistence logic (save, update, delete, find) is handled by a separate repository class.
    // This class (Task) is purely a data entity.
    // Example methods (would typically be in a TaskRepository.js):
    // static async find(id) { /* ... fetch from DB ... */ }
    // async save() { /* ... persist this instance via repository ... */ }

    // TODO: Relationships
    // The 'project()' and 'assignee()' methods defined in Laravel are for Eloquent relationships.
    // In a no-ORM Node.js setup, these relationships are typically handled by fetching related entities explicitly
    // via their respective repositories or services. The Task entity itself would only hold the foreign keys (projectId, assignedTo).
    // Example (would typically be in a TaskService.js or by directly calling repositories):
    // async getProject() {
    //   if (this.projectId) {
    //     // import { ProjectRepository } from '../repositories/ProjectRepository.js';
    //     // return ProjectRepository.findById(this.projectId);
    //   }
    //   return null;
    // }
    // async getAssignee() {
    //   if (this.assignedTo) {
    //     // import { UserRepository } from '../repositories/UserRepository.js';
    //     // return UserRepository.findById(this.assignedTo);
    //   }
    //   return null;
    // }

    // TODO: $fillable attributes
    // The properties 'projectId', 'title', 'description', 'status', 'assignedTo' correspond to the
    // '$fillable' array in the Laravel model. These are the attributes that can be mass-assigned.
    // In this JS entity, they are simply the class properties.

    // TODO: $casts attributes
    // The 'status' attribute was cast to `TaskStatus::class`.
    // In JavaScript, you'll need to implement explicit casting logic in the `from()` and `toJSON()` methods
    // if `TaskStatus` is a specific enum object/class, or ensure consistent type handling (e.g., string, number).

    // TODO: $hidden attributes
    // If the Laravel model had `protected $hidden = [...]`, those attributes would be omitted
    // from the `toJSON()` method to prevent them from being serialized (e.g., 'password').
    // Since this model has no `$hidden`, this is a general note.
}

export default { Task };