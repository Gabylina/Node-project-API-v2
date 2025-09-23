const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const users = MEM.users;

// Simple password hashing/comparison (for demonstration, not secure for production)
const hash = p => `${p}_hashed`;

// Generate base64url random string for tokens
const generateToken = () => {
    // Using Buffer for crypto-safe random bytes, part of Node.js global scope.
    // Falls back to Math.random for environments without Buffer (e.g., some edge runtimes)
    let randomBytes;
    if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        randomBytes = Buffer.alloc(24);
        // Node's crypto.randomFillSync would be better, but avoiding external 'crypto' import for strictness
        for (let i = 0; i < randomBytes.length; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    } else {
        // Fallback for non-Node environments if Buffer is not available
        randomBytes = [];
        for (let i = 0; i < 24; i++) {
            randomBytes.push(Math.floor(Math.random() * 256));
        }
        // Simple hex encoding for fallback, not strictly base64url
        return 'mtok.' + randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return 'mtok.' + randomBytes.toString('base64url');
};

// Helper to extract token from various headers/query parameters
const extractToken = (req) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        return token.slice(7, token.length);
    }
    if (req.headers['x-access-token']) {
        return req.headers['x-access-token'];
    }
    if (req.query.token) {
        return req.query.token;
    }
    return null;
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
        }

        const lowerEmail = email.toLowerCase();
        if (users.some(user => user.email === lowerEmail)) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        const hashedPassword = hash(password);
        const newUser = {
            id: MEM.seq.user++,
            name,
            email: lowerEmail,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        const token = generateToken();
        MEM.sessions[token] = newUser.id;

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (e) {
        return next(e);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
        }

        const lowerEmail = email.toLowerCase();
        const user = users.find(u => u.email === lowerEmail);

        if (!user || hash(password) !== user.password) {
            return res.status(422).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken();
        MEM.sessions[token] = user.id;

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (e) {
        return next(e);
    }
}

export async function me(req, res, next) {
    try {
        // Assumes req.user is set by an authentication middleware based on the token.
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (e) {
        return next(e);
    }
}

export async function logout(req, res, next) {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(400).json({ message: 'Token de autorización no proporcionado.' });
        }

        if (MEM.sessions[token]) {
            delete MEM.sessions[token];
            return res.status(200).json({ message: 'Sesión cerrada' });
        } else {
            return res.status(400).json({ message: 'Token de autorización inválido.' });
        }
    } catch (e) {
        return next(e);
    }
}

export const __users = MEM.users;

export default {
    register,
    login,
    me,
    logout,
};
