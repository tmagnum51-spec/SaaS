// export function isProjectAdmin(role) {
//   return role === 'ADMIN' || role === 'ADMINISTRATOR';
// }

// export function isProjectContributor(role) {
//   return role === 'CONTRIBUTOR';
// }

// export function isTaskCreator(task, currentUserId) {
//   return Boolean(currentUserId && task?.creatorId === currentUserId);
// }

// export function canCreateTask(role) {
//   return isProjectAdmin(role) || isProjectContributor(role);
// }

// export function canEditTask(role) {
//   return isProjectAdmin(role);
// }

// export function canDeleteTask(task, role, currentUserId) {
//   // Respecte la règle : uniquement si l'utilisateur est celui qui a créé la tâche
//   // (ajoute `|| isProjectAdmin(role)` si un admin doit aussi pouvoir supprimer les tâches des autres)
//   return isTaskCreator(task, currentUserId);
// }

// export function getTaskPermissions(task, role, currentUserId) {
//   const canEdit = canEditTask(role);
//   const canDelete = canDeleteTask(task, role, currentUserId);

//   return {
//     canEdit,
//     canDelete,
//     hasAnyTaskAction: canEdit || canDelete,
//   };
// }
// export function getUserProjectRole(project, currentUserOrId) {
//   const userId =
//     typeof currentUserOrId === 'string'
//       ? currentUserOrId
//       : currentUserOrId?.id ?? currentUserOrId?._id;

//   if (!project || !userId) return null;

//   const member = Array.isArray(project.members)
//     ? project.members.find((m) => m.user?.id === userId || m.userId === userId)
//     : null;

//   if (member?.role) {
//     return member.role;
//   }

//   if (project.ownerId === userId || project.owner?.id === userId) {
//     return 'OWNER';
//   }

//   return null;
// }
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