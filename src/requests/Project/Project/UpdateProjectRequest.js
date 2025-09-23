/* migrated from app/Http/Requests/Project/UpdateProjectRequest.php */

export function UpdateProjectRequest(req, res, next) {
    const errors = [];
    const data = req.body; // Assuming request data is in req.body

    // Validate 'name' field
    if (Object.prototype.hasOwnProperty.call(data, 'name')) {
        const name = data.name;
        if (typeof name !== 'string') {
            errors.push({ field: 'name', message: 'The name must be a string.' });
        } else if (name.length > 255) {
            errors.push({ field: 'name', message: 'The name must not be greater than 255 characters.' });
        }
    }

    // Validate 'description' field
    if (Object.prototype.hasOwnProperty.call(data, 'description')) {
        const description = data.description;
        // 'nullable' rule: if value is null, it's valid for this rule
        if (description === null) {
            // Valid, no further type checks needed for 'string' if null
        } else if (typeof description !== 'string') {
            errors.push({ field: 'description', message: 'The description must be a string or null.' });
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default {
    UpdateProjectRequest
};
