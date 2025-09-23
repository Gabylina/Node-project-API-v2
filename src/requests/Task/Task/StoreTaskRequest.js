/* migrated from app/Http/Requests/Task/StoreTaskRequest.php */

export function StoreTaskRequest(req, res, next) {
    const errors = [];
    const data = req.body;

    // Validate 'title' field
    // Rule: required
    if (data.title === undefined || data.title === null || data.title === '') {
        errors.push({ field: 'title', message: 'The title field is required.' });
    } else {
        // Rule: string
        if (typeof data.title !== 'string') {
            errors.push({ field: 'title', message: 'The title field must be a string.' });
        }
        // Rule: max:255
        else if (data.title.length > 255) {
            errors.push({ field: 'title', message: 'The title field must not exceed 255 characters.' });
        }
    }

    // Validate 'description' field
    // Rule: nullable (no error if undefined or null)
    if (data.description !== undefined && data.description !== null) {
        // Rule: string (only applies if provided and not null)
        if (typeof data.description !== 'string') {
            errors.push({ field: 'description', message: 'The description field must be a string.' });
        }
    }

    // Validate 'assigned_to' field
    // Rule: nullable (no error if undefined or null)
    if (data.assigned_to !== undefined && data.assigned_to !== null) {
        // Rule: exists:users,id
        // This rule requires database interaction, so it's marked as TODO.
        errors.push({ field: 'assigned_to', message: 'The selected assigned_to is invalid. // TODO: Implement database lookup for exists:users,id' });
    }

    // If any errors were found, send a 422 Unprocessable Entity response
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    // If validation passes, proceed to the next middleware/route handler
    next();
}

export default {
    StoreTaskRequest
};
