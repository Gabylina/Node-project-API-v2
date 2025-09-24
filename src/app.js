// src/app.js
import express from 'express';
import routes from './routes/index.js';

const app = express();
app.use(express.json());

// monta todas las rutas bajo /api (incluye GET /api/ping)
app.use('/api', routes);

export default app;
