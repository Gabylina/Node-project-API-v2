// migrated from app/Events/TaskStatusUpdated.php
export class TaskStatusUpdated {
  static event = 'TaskStatusUpdated';
  constructor(payload = {}) {
    Object.assign(this, payload);
  }
}


export default { TaskStatusUpdated };