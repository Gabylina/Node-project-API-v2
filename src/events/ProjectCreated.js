// migrated from app/Events/ProjectCreated.php

export class ProjectCreated {
  static event='ProjectCreated';

  constructor(payload={}){
    Object.assign(this,payload);
  }
}

export default { ProjectCreated };