const MEM = (globalThis.__MEMDB ??= { users: [], projects: [], tasks: [], sessions: {}, seq: { user: 1, project: 1, task: 1 } });

const projects = MEM.projects;
const tasks = MEM.tasks;

const getParam = (req, ...keys) => {
  for (const key of keys) {
    const value = req?.params?.[key];
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
};

const normalizeStatus = s => {
  const v = String(s ?? '').toLowerCase().replace(/_/g, '-');
  return ['pending', 'in-progress', 'completed'].includes(v) ? v : 'pending';
};

const authorizeOwner = (reqUser, itemOwnerId) => {
  if (!reqUser || reqUser.id !== itemOwnerId) {
    const error = new Error('No autorizado.');
    error.status = 403;
    throw error;
  }
};

export async function index(req, res, next) {
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

    authorizeOwner(req.user, project.userId);

    const projectTasks = tasks.filter(t => t.projectId === projectId);
    return res.status(200).json(projectTasks);
  } catch (e) {
    return next(e);
  }
}

export async function store(req, res, next) {
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

    authorizeOwner(req.user, project.userId);

    const { name, description, status } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'El nombre de la tarea es obligatorio.' });
    }

    const now = new Date().toISOString();
    const newTask = {
      id: MEM.seq.task++,
      projectId,
      userId: req.user.id,
      name,
      description: description ?? null,
      status: normalizeStatus(status ?? 'pending'),
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
  } catch (e) {
    return next(e);
  }
}

export async function show(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = Number(getParam(req, 'project', 'projectId'));
    const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    authorizeOwner(req.user, project.userId);

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function update(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = Number(getParam(req, 'project', 'projectId'));
    const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    authorizeOwner(req.user, project.userId);

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const { name, description, status } = req.body;
    let updated = false;

    if (name !== undefined && typeof name === 'string' && name.trim() !== '') {
      task.name = name;
      updated = true;
    }
    if (description !== undefined) {
      task.description = description === '' ? null : description;
      updated = true;
    }
    if (status !== undefined) {
      const normalizedStatus = normalizeStatus(status);
      if (task.status !== normalizedStatus) {
        task.status = normalizedStatus;
        updated = true;
      }
    }

    if (updated) {
      task.updatedAt = new Date().toISOString();
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export async function destroy(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = Number(getParam(req, 'project', 'projectId'));
    const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    authorizeOwner(req.user, project.userId);

    const taskIndex = tasks.findIndex(t => t.id === taskId && t.projectId === projectId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).send();
  } catch (e) {
    return next(e);
  }
}

export async function changeStatus(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const projectId = Number(getParam(req, 'project', 'projectId'));
    const taskId = Number(getParam(req, 'task', 'taskId', 'id'));

    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'ID de proyecto inválido.' });
    }
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const { status } = req.body;
    if (status === undefined || typeof status !== 'string' || !['pending', 'in-progress', 'completed'].includes(normalizeStatus(status))) {
      return res.status(400).json({ message: 'El estado de la tarea es obligatorio y debe ser "pending", "in-progress" o "completed".' });
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    authorizeOwner(req.user, project.userId);

    const task = tasks.find(t => t.id === taskId && t.projectId === projectId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const newStatus = normalizeStatus(status);
    if (task.status !== newStatus) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
    }

    return res.status(200).json(task);
  } catch (e) {
    return next(e);
  }
}

export default {
  index,
  store,
  show,
  update,
  destroy,
  changeStatus,
};

export const __tasks = MEM.tasks;
