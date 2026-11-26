
const toId = (val) => (val == null ? null : String(val));

export function isInProject(project, userId) {
  const uid = toId(userId);
  if (!uid || !project) return false;

  const ownerId = toId(project.ownerId ?? project.owner?.id);
  if (ownerId === uid) return true;

  const members = Array.isArray(project.members) ? project.members : [];
  return members.some((m) => {
    const memberId = toId(m?.userId ?? m?.user?.id ?? m?.id);
    return memberId === uid;
  });
}
export function isTaskCreator(task, userId) {
  const uid = toId(userId);
  const creatorId = toId(task?.creatorId);
  return uid !== null && creatorId !== null && creatorId === uid;
}

export function canEditTask(project, userId) {
  return isInProject(project, userId);
}

export function canDeleteTask(task, project, userId) {
  const uid = toId(userId);
  const ownerId = toId(project?.ownerId ?? project?.owner?.id);
  return isTaskCreator(task, uid) || (uid !== null && ownerId === uid);
}