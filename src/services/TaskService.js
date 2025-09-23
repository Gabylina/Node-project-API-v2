// migrated from app/Services/TaskService.php

/**
 * @typedef {object} Task
 * @property {string} id - Unique identifier for the task.
 * @property {string} projectId - ID of the project the task belongs to.
 * @property {string} title - The title of the task.
 * @property {string | null} description - The description of the task.
 * @property {string | null} assignedTo - ID of the user assigned to the task, if any.
 * @property {string} status - The current status of the task (e.g., 'pending', 'completed').
 * @property {Date} createdAt - The creation timestamp.
 * @property {Date} updatedAt - The last update timestamp.
 */

/**
 * @typedef {object} Project
 * @property {string} id - Unique identifier for the project.
 * @property {string} name - The name of the project.
 * // ... other project properties relevant to the service
 */

// TODO: Import TaskStatus enum from a shared location, e.g., import { TaskStatus } from '../enums/TaskStatus.js';
// For now, defining a placeholder to ensure the code structure works. In a real application, this should be a robust enum.
const TaskStatusPlaceholder = {
    PENDING: 'pending',
    // Add other relevant statuses here, e.g., IN_PROGRESS: 'in_progress', COMPLETED: 'completed'
};

export class TaskService {
    /**
     * @param {object} deps - Dependencies object.
     * @param {object} deps.taskRepository - An object providing methods for Task data access (e.g., listTasksByProjectId, create, update).
     * @param {object} [deps.eventBus] - An optional event bus for dispatching events (e.g., when a task's status changes).
     * @param {object} [deps.TaskStatusEnum] - An optional TaskStatus enum object to override the default placeholder.
     */
    constructor(deps = {}) {
        this.deps = deps;
        this.taskStatus = deps.TaskStatusEnum || TaskStatusPlaceholder; // Use injected enum or fallback to placeholder

        if (!this.deps.taskRepository) {
            throw new Error('TaskService requires a taskRepository dependency.');
        }
    }

    /**
     * Lists tasks for a given project, paginated and optionally including assignee details.
     * Corresponds to `project->tasks()->with('assignee:id,name,email')->latest()->paginate(10)`.
     * @param {Project} project - The project object for which to list tasks. Must contain an `id`.
     * @returns {Promise<object>} - A paginated list of tasks, typically in the format:
     *   `{ items: Task[], meta: { total: number, page: number, limit: number, totalPages: number } }`.
     * @throws {Error} If the project object or its ID is missing.
     */
    async list(project) {
        if (!project || !project.id) {
            throw new Error('Project object with ID is required to list tasks.');
        }

        // The original Laravel method implies pagination (10 items per page) and eager loading of the assignee.
        // The taskRepository should encapsulate this logic.
        const page = 1; // Default to page 1, or pass as an argument to the service method if needed.
        const limit = 10;
        const sort = { field: 'createdAt', direction: 'desc' }; // Equivalent to Laravel's `latest()`
        // Equivalent to Laravel's `with('assignee:id,name,email')`
        const populate = [{ path: 'assignee', select: ['id', 'name', 'email'] }];

        const result = await this.deps.taskRepository.listTasksByProjectId(
            project.id,
            { page, limit, sort, populate }
        );

        return result;
    }

    /**
     * Creates a new task for a specified project.
     * Corresponds to `project->tasks()->create([...])`.
     * @param {Project} project - The project object under which the task will be created. Must contain an `id`.
     * @param {object} data - Task data for creation.
     * @param {string} data.title - The title of the task (required).
     * @param {string | null} [data.description] - The description of the task.
     * @param {string | null} [data.assigned_to] - The ID of the user assigned to the task. (Note: original PHP snake_case).
     * @returns {Promise<Task>} - The newly created task object. (Equivalent to Laravel's `->fresh()`)
     * @throws {Error} If the project object, its ID, or the task title is missing.
     */
    async create(project, data) {
        if (!project || !project.id) {
            throw new Error('Project object with ID is required to create a task.');
        }
        if (!data.title) {
            throw new Error('Task title is required.');
        }

        const taskData = {
            projectId: project.id,
            title: data.title,
            description: data.description ?? null,
            assigned_to: data.assigned_to ?? null, // Convert PHP snake_case 'assigned_to' to JS camelCase 'assignedTo'
            status: this.taskStatus.PENDING, // Use the predefined PENDING status
        };

        const newTask = await this.deps.taskRepository.create(taskData);
        // Assuming the repository returns the complete, fresh task object after creation.
        return newTask;
    }

    /**
     * Updates an existing task.
     * Corresponds to `task->update($data)` and `TaskStatusUpdated::dispatch($task)`.
     * @param {Task} task - The task object to update. Must contain an `id`.
     * @param {object} data - Data to update the task with.
     * @param {string} [data.title] - New title for the task.
     * @param {string | null} [data.description] - New description for the task.
     * @param {string | null} [data.assigned_to] - New assignee ID for the task. (Note: original PHP snake_case).
     * @param {string} [data.status] - New status for the task.
     * @returns {Promise<Task>} - The updated task object. (Equivalent to Laravel's `->fresh()`)
     * @throws {Error} If the task object, its ID, or no update data is provided.
     */
    async update(task, data) {
        if (!task || !task.id) {
            throw new Error('Task object with ID is required to update.');
        }
        if (Object.keys(data).length === 0) {
            throw new Error('No data provided for update.');
        }

        const oldStatus = task.status;

        // Prepare update payload, converting snake_case to camelCase for consistency
        const updatePayload = {};
        if (data.title !== undefined) updatePayload.title = data.title;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.assigned_to !== undefined) updatePayload.assignedTo = data.assigned_to; // Convert PHP snake_case 'assigned_to' to JS camelCase 'assignedTo'
        if (data.status !== undefined) updatePayload.status = data.status;

        const updatedTask = await this.deps.taskRepository.update(task.id, updatePayload);
        // Assuming the repository returns the complete, fresh task object after update.

        // Check if status changed and dispatch event, similar to `TaskStatusUpdated::dispatch($task)`.
        if (Object.prototype.hasOwnProperty.call(data, 'status') && oldStatus !== updatedTask.status) {
            if (this.deps.eventBus) {
                // TODO: Define the contract for 'TaskStatusUpdated' event. Often includes the updated entity.
                this.deps.eventBus.dispatch('TaskStatusUpdated', { task: updatedTask });
            } else {
                // Log a warning if the eventBus dependency is missing but an event was supposed to be dispatched.
                console.warn(`EventBus not provided to TaskService. Could not dispatch TaskStatusUpdated event for task ${updatedTask.id}.`);
            }
        }

        return updatedTask;
    }
}


export default { TaskService };