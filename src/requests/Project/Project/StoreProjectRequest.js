/* migrated from app/Http/Requests/Project/StoreProjectRequest.php */

export function StoreProjectRequest(req, res, next) {
  const errors = [];
  const data = req.body; // Assuming the data is in req.body for a Store request

  // --- Validation for 'name' field ---
  const name = data.name;

  // Rule: 'required'
  if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
    errors.push({ field: 'name', message: 'The name field is required.' });
  } else {
    // Rule: 'string'
    if (typeof name !== 'string') {
      errors.push({ field: 'name', message: 'The name field must be a string.' });
    } else {
      // Rule: 'max:255'
      if (name.length > 255) {
        errors.push({ field: 'name', message: 'The name field must not exceed 255 characters.' });
      }
    }
  }

  // --- Validation for 'description' field ---
  const description = data.description;

  // Rule: 'nullable'
  // If description is undefined or null, it's valid and no further checks are needed.
  if (description !== undefined && description !== null) {
    // Rule: 'string'
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'The description field must be a string.' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
}

export default {
  StoreProjectRequest
};
