/* migrated from app/Http/Requests/Auth/RegisterRequest.php */

export function RegisterRequest(req, res, next) {
    const errors = [];
    const addError = (field, message) => errors.push({ field, message });

    // Helper for required check: null, undefined, or empty string after trim
    const isRequired = (value) => value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

    // --- Validation for 'name' ---
    const name = req.body.name;
    if (isRequired(name)) {
        addError('name', 'The name field is required.');
    } else {
        if (typeof name !== 'string') {
            addError('name', 'The name field must be a string.');
        } else if (name.length > 255) {
            addError('name', 'The name field must not be greater than 255 characters.');
        }
    }

    // --- Validation for 'email' ---
    const email = req.body.email;
    if (isRequired(email)) {
        addError('email', 'The email field is required.');
    } else {
        if (typeof email !== 'string') {
            addError('email', 'The email field must be a string.');
        } else {
            if (email.length > 255) {
                addError('email', 'The email field must not be greater than 255 characters.');
            }
            // Basic email format validation
            if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email)) {
                addError('email', 'The email field must be a valid email address.');
            }
            // TODO: unique:users,email validation (requires database access)
            // Example: const existingUser = await User.findOne({ email: email });
            // if (existingUser) { addError('email', 'The email has already been taken.'); }
        }
    }

    // --- Validation for 'password' ---
    const password = req.body.password;
    const passwordConfirmation = req.body.password_confirmation; // Laravel's 'confirmed' rule expects field_confirmation

    if (isRequired(password)) {
        addError('password', 'The password field is required.');
    } else {
        if (typeof password !== 'string') {
            addError('password', 'The password field must be a string.');
        } else {
            if (password.length < 8) {
                addError('password', 'The password field must be at least 8 characters.');
            }
            // 'confirmed' rule: check if password matches password_confirmation
            if (password !== passwordConfirmation) {
                addError('password', 'The password confirmation does not match.');
            }
        }
    }

    // If any errors were collected, return a 422 Unprocessable Entity response
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    // If validation passes, proceed to the next middleware/route handler
    next();
}

export default {
    RegisterRequest
};
