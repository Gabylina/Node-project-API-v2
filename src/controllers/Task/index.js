const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
    for (const key of keys) {
        if (req?.params?.[key] !== undefined) {
            return req.params[key];
        }
    }
    return undefined;
};

const normalizeStatus = s => {
    const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
    return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const isValidTaskStatusInput = (s) => {
    const lowerS = String(s ?? '').toLowerCase();
    return ['pending', 'in-progress', 'completed', 'in_progress'].includes(lowerS);
};

const authorizeOwner = (req, res, project) => {
    if (!req.user) {
        res.status(401).json({ message: 'No autenticado' });
        return false;
    }
    if (project.userId !== req.user.id) {
        res.status(403).json({ message: 'No autorizado' });
        return false;
    }
    return true;
};

export async function index(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const projectTasks = tasks.filter(t => t.projectId === projectId);
        return res.status(200).json(projectTasks);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const { title, description, status } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'El título es requerido.' });
        }
        if (status !== undefined && !isValidTaskStatusInput(status)) {
            return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pending, in-progress, completed (in_progress es alias para in-progress).' });
        }

        const newTask = {
            id: MEM.seq.task++,
            projectId: projectId,
            userId: req.user.id,
            title: title.trim(),
            description: description?.trim() ?? null,
            status: status !== undefined ? normalizeStatus(status) : 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tasks.push(newTask);
        return res.status(201).json(newTask);
    } catch (e) {
        return next(e);
    }
}

export async function show(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId'));
        const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

        if (isNaN(projectId) || projectId <= 0 || isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId'));
        const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

        if (isNaN(projectId) || projectId <= 0 || isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        const task = tasks[taskIndex];
        const { title, description, status } = req.body;

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({ message: 'El título no puede estar vacío.' });
            }
            task.title = title.trim();
        }
        if (description !== undefined) {
            task.description = description?.trim() ?? null;
        }
        if (status !== undefined) {
            if (!isValidTaskStatusInput(status)) {
                return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pending, in-progress, completed (in_progress es alias para in-progress).' });
            }
            task.status = normalizeStatus(status);
        }

        task.updatedAt = new Date().toISOString();
        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId'));
        const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

        if (isNaN(projectId) || projectId <= 0 || isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        tasks.splice(taskIndex, 1);
        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const projectId = Number(getParam(req, 'project', 'projectId'));
        const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

        if (isNaN(projectId) || projectId <= 0 || isNaN(taskId) || taskId <= 0) {
            return res.status(400).json({ message: 'IDs de proyecto o tarea inválidos.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!authorizeOwner(req, res, project)) {
            return;
        }

        const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Tarea no encontrada en este proyecto.' });
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'El estado es requerido.' });
        }
        if (!isValidTaskStatusInput(status)) {
            return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pending, in-progress, completed (in_progress es alias para in-progress).' });
        }

        const task = tasks[taskIndex];
        task.status = normalizeStatus(status);
        task.updatedAt = new Date().toISOString();
        return res.status(200).json(task);
    } catch (e) {
        return next(e);
    }
}

export const __tasks = MEM.tasks;
export const __projects = MEM.projects;

export default {
    index,
    store,
    show,
    update,
    destroy,
    changeStatus,
};
