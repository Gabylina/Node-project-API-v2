// migrated from app/Listeners/SendTaskStatusNotification.php

/**
 * @typedef {object} TaskStatusUpdatedEvent - Represents the data structure expected from the TaskStatusUpdated event.
 * @property {object} task - The task object, potentially with nested relationships (project, assignee).
 * @property {number} task.id - The unique identifier of the task.
 * @property {string} task.name - The name/title of the task.
 * @property {string} task.status - The current status of the task (e.g., 'pending', 'completed').
 * @property {object} [task.assignee] - The assignee user object, if one exists (must have an 'id' property).
 * @property {object} [task.project] - The project object to which the task belongs.
 * @property {object} [task.project.owner] - The project owner user object (must have an 'id' property).
 */

export class SendTaskStatusNotification {
  /**
   * Handles the TaskStatusUpdated event to send notifications to the task's assignee and project owner.
   * @param {TaskStatusUpdatedEvent} event - The event object containing task information.
   * @param {object} deps - Dependencies required by the listener.
   * @param {object} [deps.notificationService] - An object with a `send` method for dispatching notifications.
   * @param {object} [deps.taskService] - An object with a `loadTaskWithRelations` method to fetch task data with relationships.
   */
  async handle(event, deps = {}) {
    const { notificationService, taskService } = deps;

    if (!notificationService) {
      console.warn('SendTaskStatusNotification: notificationService dependency is missing. Cannot send notifications.');
      // Depending on your application's error handling strategy, you might throw an error or return early.
      return;
    }

    // --- Original PHP Logic --- 
    // $task = $event->task->load('project.owner');
    // In Node.js, this typically means fetching the task with its relationships 
    // from a database or a dedicated service. The `event.task` might contain 
    // partial data, and we need to ensure 'project', 'owner', and 'assignee' 
    // are fully loaded to avoid `null` or `undefined` issues.

    let task = event.task; // Start with the task data provided by the event

    // TODO: Implement actual relationship loading logic using a taskService or ORM.
    // If your event producer guarantees that `event.task` already has `project.owner` and `assignee` loaded,
    // this step can be simplified or removed.
    if (taskService && typeof taskService.loadTaskWithRelations === 'function') {
      try {
        // Attempt to load the task with necessary relations. Assumes taskService handles this.
        task = await taskService.loadTaskWithRelations(task.id, ['project.owner', 'assignee']);
      } catch (error) {
        console.error(`Error loading task relations for ID ${task.id}:`, error);
        // Depending on your error policy, you might rethrow, log, or continue with partial data.
        return; // Abort if essential task data cannot be loaded
      }
    } else {
      console.warn('SendTaskStatusNotification: taskService or loadTaskWithRelations method is missing or not provided. Relying on event.task to contain pre-loaded project.owner and assignee relationships.');
      // Ensure the event producer properly populates these relationships if no taskService is used here.
    }

    // Validate that the task object is available after potential loading
    if (!task) {
      console.error('SendTaskStatusNotification: Task object is undefined after processing. Aborting notification.');
      return;
    }

    // if ($task->assignee) {
    //     $task->assignee->notify(new TaskStatusChangedNotification($task));
    // }
    if (task.assignee && task.assignee.id) {
      // TODO: Define the structure of the notification payload that your `notificationService` expects.
      // This payload replaces the `TaskStatusChangedNotification` PHP class instance.
      const assigneeNotificationPayload = {
        type: 'task_status_changed', // A type identifier for the notification
        recipientId: task.assignee.id, // The ID of the user to notify
        data: {
          taskId: task.id,
          taskName: task.name,
          newStatus: task.status,
          projectId: task.project?.id, // Use optional chaining for safety
          // Include any other relevant task data needed for the notification message/content
        },
        // You might add channels (e.g., 'email', 'push'), priority, etc., depending on your service
      };
      await notificationService.send(assigneeNotificationPayload);
      console.log(`Notification sent to assignee ${task.assignee.id} for task ${task.id}.`);
    }

    // $task->project->owner->notify(new TaskStatusChangedNotification($task));
    if (task.project?.owner && task.project.owner.id) {
      // TODO: Define the structure of the notification payload that your `notificationService` expects.
      const ownerNotificationPayload = {
        type: 'task_status_changed',
        recipientId: task.project.owner.id,
        data: {
          taskId: task.id,
          taskName: task.name,
          newStatus: task.status,
          projectId: task.project.id,
          // Include any other relevant task data needed for the notification message/content
        },
      };
      await notificationService.send(ownerNotificationPayload);
      console.log(`Notification sent to project owner ${task.project.owner.id} for task ${task.id}.`);
    } else {
      console.warn(`SendTaskStatusNotification: Project owner not found or missing ID for task ID: ${task.id}. Notification skipped.`);
    }
  }
}


export default { SendTaskStatusNotification };