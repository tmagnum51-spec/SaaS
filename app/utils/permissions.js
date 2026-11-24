export function isProjectAdmin(role) {
  return role === 'ADMIN' || role === 'ADMINISTRATOR';
}

export function isProjectContributor(role) {
  return role === 'CONTRIBUTOR';
}

export function isTaskCreator(task, currentUserId) {
  return Boolean(currentUserId && task?.creatorId === currentUserId);
}

export function canCreateTask(role) {
  return isProjectAdmin(role) || isProjectContributor(role);
}

export function canEditTask(role) {
  return isProjectAdmin(role);
}

export function canDeleteTask(task, role, currentUserId) {
  // Respecte la règle : uniquement si l'utilisateur est celui qui a créé la tâche
  // (ajoute `|| isProjectAdmin(role)` si un admin doit aussi pouvoir supprimer les tâches des autres)
  return isTaskCreator(task, currentUserId);
}

export function getTaskPermissions(task, role, currentUserId) {
  const canEdit = canEditTask(role);
  const canDelete = canDeleteTask(task, role, currentUserId);

  return {
    canEdit,
    canDelete,
    hasAnyTaskAction: canEdit || canDelete,
  };
}
export function getUserProjectRole(project, currentUserOrId) {
  const userId =
    typeof currentUserOrId === 'string'
      ? currentUserOrId
      : currentUserOrId?.id ?? currentUserOrId?._id;

  if (!project || !userId) return null;

  const member = Array.isArray(project.members)
    ? project.members.find((m) => m.user?.id === userId || m.userId === userId)
    : null;

  if (member?.role) {
    return member.role;
  }

  if (project.ownerId === userId || project.owner?.id === userId) {
    return 'OWNER';
  }

  return null;
}