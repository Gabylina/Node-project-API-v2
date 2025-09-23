// migrated from app/Listeners/SendProjectCreatedNotification.php

import { ProjectCreatedNotification } from '../notifications/ProjectCreatedNotification.js';
// TODO: Verify and adjust the import path for ProjectCreatedNotification.js based on your project's structure.

/**
 * @typedef {object} ProjectCreatedEvent
 * @property {object} project - The project object.
 * @property {object} project.owner - The owner of the project (e.g., User object).
 * @property {function(Notification): Promise<void>} [project.owner.notify] - Optional method to send a notification to the owner.
 */

export class SendProjectCreatedNotification {
    /**
     * Handles the ProjectCreated event by sending a notification to the project owner.
     *
     * @param {ProjectCreatedEvent} event - The event object, expected to contain `event.project` and `event.project.owner`.
     *   The `event.project.owner` object is expected to have a `notify(notificationInstance)` method
     *   or a notification sender needs to be provided via `deps`.
     * @param {object} [deps] - Optional dependencies.
     * @param {object} [deps.notificationSender] - An optional service responsible for sending notifications.
     *   If provided, it must have a `send(recipient, notification)` method and will be preferred over `owner.notify()`.
     */
    async handle(event, deps = {}) {
        const { notificationSender } = deps;

        // Basic validation for expected event structure
        if (!event?.project?.owner) {
            console.error("Invalid ProjectCreated event structure. Expected 'event.project.owner'.", event);
            throw new Error("Missing required event data for SendProjectCreatedNotification.");
        }

        // Instantiate the notification, similar to `new ProjectCreatedNotification($event->project)`
        const notification = new ProjectCreatedNotification(event.project);

        if (notificationSender && typeof notificationSender.send === 'function') {
            // Option 1: Use an injected notification sender service (e.g., a centralized service)
            await notificationSender.send(event.project.owner, notification);
        } else if (typeof event.project.owner.notify === 'function') {
            // Option 2: Mimic Laravel's Notifiable trait if the owner object directly supports `notify()`
            await event.project.owner.notify(notification);
        } else {
            // TODO: Establish a concrete notification sending mechanism in Node.js.
            // This is a critical step in migrating Laravel's Notifiable functionality,
            // as Node.js does not have a built-in equivalent to Laravel's `Notifiable` trait.
            console.error(
                "Could not send ProjectCreatedNotification. Neither `deps.notificationSender.send` nor `event.project.owner.notify` method found.",
                { owner: event.project.owner, notificationInstance: notification }
            );
            throw new Error("Failed to send ProjectCreatedNotification: no valid sender mechanism found.");
        }

        // Optional: Add logging for successful notification sending
        // console.log(`ProjectCreatedNotification sent for project ${event.project.id} to owner ${event.project.owner.id}`);
    }
}


export default { SendProjectCreatedNotification };