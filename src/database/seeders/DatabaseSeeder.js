/* migrated from database/seeders/DatabaseSeeder.php */

import TaskStatus from '../../enums/TaskStatus.js';

/**
 * Seeds the database with initial demo data.
 * @param {object} deps
 * @param {object} deps.userRepo - must have create(...) and either findOrCreate(...) or findByEmail(...)
 * @param {object} deps.projectRepo - must have create(...)
 * @param {object} deps.taskRepo - must have create(...)
 * @param {object} deps.hasher - must have make(password)
 * @param {object} [deps.logger] - optional logger, defaults to console
 */
export async function seed(deps = {}) {
  const { userRepo, projectRepo, taskRepo, hasher, logger = console } = deps;

  // Validate dependencies
  if (!userRepo || typeof userRepo.create !== 'function' || (!userRepo.findOrCreate && !userRepo.findByEmail)) {
    throw new Error('userRepo must expose create(...) and either findOrCreate(...) or findByEmail(...).');
  }
  if (!projectRepo || typeof projectRepo.create !== 'function') {
    throw new Error('projectRepo must expose create(...).');
  }
  if (!taskRepo || typeof taskRepo.create !== 'function') {
    throw new Error('taskRepo must expose create(...).');
  }
  if (!hasher || typeof hasher.make !== 'function') {
    throw new Error('hasher must expose make(password).');
  }
  if (!TaskStatus || !TaskStatus.PENDING || !TaskStatus.IN_PROGRESS) {
    throw new Error('TaskStatus enum (PENDING/IN_PROGRESS) is required.');
  }

  logger.info('Seeding initial database data...');

  const hashedPassword = await hasher.make('password');

  // User::firstOrCreate equivalent (fallback to findByEmail + create)
  const user = userRepo.findOrCreate
    ? await userRepo.findOrCreate(
        { email: 'demo@example.com' },
        { name: 'Demo', password: hashedPassword }
      )
    : await (async () => {
        const found = await (userRepo.findByEmail?.('demo@example.com'));
        if (found) return found;
        return userRepo.create({ name: 'Demo', email: 'demo@example.com', password: hashedPassword });
      })();

  // Project::create
  const project = await projectRepo.create({
    user_id: user.id,
    name: 'Proyecto Demo',
    description: 'Proyecto inicial con tareas',
  });

  // Task::create - 1
  await taskRepo.create({
    project_id: project.id,
    title: 'Investigar requerimientos',
    status: TaskStatus.PENDING,
  });

  // Task::create - 2
  await taskRepo.create({
    project_id: project.id,
    title: 'Configurar entorno',
    status: TaskStatus.IN_PROGRESS,
  });

  logger.info('DatabaseSeeder completed successfully.');
}

export default { seed };
