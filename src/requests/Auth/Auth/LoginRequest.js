/* migrated from app/Http/Requests/Auth/LoginRequest.php */

export function LoginRequest(req, res, next) {
    const errors = [];
    // Laravel Form Requests typically validate input from the request body, query parameters, or route parameters.
    // For login, we'll assume the data is in req.body.
    const data = req.body;

    // Validate 'email'
    // Rule: ['required', 'email']
    if (!data.email || String(data.email).trim() === '') {
        errors.push({ field: 'email', message: 'The email field is required.' });
    } else {
        // The 'email' rule in Laravel implicitly checks for string type before validation.
        // We'll ensure it's treated as a string for validation here.
        const emailValue = String(data.email);
        // Basic email regex for validation
        if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(emailValue)) {
            errors.push({ field: 'email', message: 'The email field must be a valid email address.' });
        }
    }

    // Validate 'password'
    // Rule: ['required', 'string']
    if (!data.password || String(data.password).trim() === '') {
        errors.push({ field: 'password', message: 'The password field is required.' });
    } else {
        // string
        if (typeof data.password !== 'string') {
            errors.push({ field: 'password', message: 'The password field must be a string.' });
        }
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
}

export default { LoginRequest };
