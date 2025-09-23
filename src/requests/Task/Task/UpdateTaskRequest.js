/* migrated from app/Http/Requests/Task/UpdateTaskRequest.php */

// In a real application, TaskStatus values would ideally be imported from a central enum definition.
// For this migration, we define example values based on typical task statuses.
const TASK_STATUS_VALUES = ['pending', 'in_progress', 'done', 'cancelled'];

export function UpdateTaskRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Laravel Form Requests typically validate request body (JSON, form data)

    // Helper function for adding errors
    const addError = (field, message) => {
        errors.push({ field, message });
    };

    // Rule: 'title' => ['sometimes','string','max:255']
    // Validates 'title' only if it is present in the request body
    if (Object.prototype.hasOwnProperty.call(data, 'title')) {
        const value = data.title;
        if (typeof value !== 'string') {
            addError('title', 'The title must be a string.');
        } else if (value.length > 255) {
            addError('title', 'The title must not be greater than 255 characters.');
        }
    }

    // Rule: 'description' => ['sometimes','nullable','string']
    // Validates 'description' only if it is present in the request body
    if (Object.prototype.hasOwnProperty.call(data, 'description')) {
        const value = data.description;
        // 'nullable' means it can be null. If not null, it must be a string.
        if (value !== null && typeof value !== 'string') {
            addError('description', 'The description must be a string or null.');
        }
    }

    // Rule: 'status' => ['sometimes','in:'.implode(',', array_column(TaskStatus::cases(), 'value'))]
    // Validates 'status' only if it is present in the request body
    if (Object.prototype.hasOwnProperty.call(data, 'status')) {
        const value = data.status;
        if (!TASK_STATUS_VALUES.includes(value)) {
            addError('status', `The selected status is invalid. Valid values are: ${TASK_STATUS_VALUES.join(', ')}.`);
        }
    }

    // Rule: 'assigned_to' => ['sometimes','nullable','exists:users,id']
    // Validates 'assigned_to' only if it is present in the request body
    if (Object.prototype.hasOwnProperty.call(data, 'assigned_to')) {
        const value = data.assigned_to;
        // 'nullable' means it can be null.
        if (value !== null) {
            // 'exists:users,id' implies it should be an ID, typically an integer.
            // We'll add a basic type check for integer.
            if (!Number.isInteger(value)) {
                addError('assigned_to', 'The assigned to field must be an integer or null.');
            }
            // TODO: Implement 'exists:users,id' validation. This typically requires a database query.
            // In an Express application, this would involve fetching from the database (e.g., using a model/ORM)
            // and would likely make this middleware an 'async' function.
            // Example for an async middleware:
            /*
            // const User = require('../models/User'); // Assuming a Mongoose/Sequelize model
            // const user = await User.findById(value);
            // if (!user) {
            //     addError('assigned_to', 'The selected assigned to ID does not exist.');
            // }
            */
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { UpdateTaskRequest };
