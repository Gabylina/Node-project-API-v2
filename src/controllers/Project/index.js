const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
    for (const key of keys) {
        if (req.params?.[key] !== undefined) {
            return req.params[key];
        }
    }
    return undefined;
};

export async function index(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const userProjects = projects.filter(p => p.userId === req.user.id);
        return res.status(200).json(userProjects);
    } catch (e) {
        return next(e);
    }
}

export async function store(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const { name, description } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre del proyecto es requerido.' });
        }

        const newProject = {
            id: MEM.seq.project++,
            userId: req.user.id,
            name: name.trim(),
            description: typeof description === 'string' ? description.trim() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        projects.push(newProject);
        return res.status(201).json(newProject);
    } catch (e) {
        return next(e);
    }
}

export async function show(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado.' });
        }

        const projectTasks = tasks.filter(t => t.projectId === projectId);
        return res.status(200).json({ ...project, tasks: projectTasks });
    } catch (e) {
        return next(e);
    }
}

export async function update(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        const project = projects[projectIndex];
        if (project.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado.' });
        }

        const { name, description } = req.body;

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({ message: 'El nombre del proyecto es requerido y debe ser una cadena.' });
            }
            project.name = name.trim();
        }

        if (description !== undefined) {
            project.description = typeof description === 'string' ? description.trim() : null;
        }

        project.updatedAt = new Date().toISOString();
        projects[projectIndex] = project; // Ensure update in place

        return res.status(200).json(project);
    } catch (e) {
        return next(e);
    }
}

export async function destroy(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const projectId = Number(getParam(req, 'project', 'projectId', 'id'));
        if (isNaN(projectId) || projectId <= 0) {
            return res.status(400).json({ message: 'ID de proyecto inválido.' });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        const projectToDelete = projects[projectIndex];
        if (projectToDelete.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado.' });
        }

        // Remove project
        projects.splice(projectIndex, 1);

        // Cascade delete tasks associated with this project
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].projectId === projectId) {
                tasks.splice(i, 1);
            }
        }

        return res.status(204).json({});
    } catch (e) {
        return next(e);
    }
}

export const __projects = MEM.projects;

export default {
    index,
    store,
    show,
    update,
    destroy
};
