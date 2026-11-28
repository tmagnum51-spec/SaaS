import { deleteTask } from '@/app/service/api';

export function useProjectTaskHandlers({
  projectId,
  token,
  setTasks,
  setError,
}) {
  const handleTaskCreated = (newTask) => {
    if (!newTask) return;
    setTasks((prev) => {
      const exists = prev.some((t) => String(t.id) === String(newTask.id));
      return exists ? prev : [newTask, ...prev];
    });
  };

  const handleTaskEdited = (updatedTask) => {
    if (!updatedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === String(updatedTask.id) ? { ...t, ...updatedTask } : t
      )
    );
  };

  const handleCommentAdded = (taskId, createdComment) => {
    if (!taskId || !createdComment) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (String(t.id) !== String(taskId)) return t;
        const existingComments = Array.isArray(t.comments) ? t.comments : [];
        return {
          ...t,
          comments: [...existingComments, createdComment],
        };
      })
    );
  };

  const handleDeleteTask = async (taskToDelete) => {
    if (!taskToDelete?.id) return;

    try {
      await deleteTask(projectId, taskToDelete.id, token ?? null);
      setTasks((prev) =>
        prev.filter((t) => String(t.id) !== String(taskToDelete.id))
      );
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
      setError?.(err.message || 'Impossible de supprimer la tâche.');
    }
  };
  

  return {
    handleTaskCreated,
    handleTaskEdited,
    handleCommentAdded,
    handleDeleteTask,
  };
}
export function useProjectHandlers({ setProjects, setError } = {}) {
  const handleProjectCreated = (newProject) => {
    if (!newProject || typeof setProjects !== 'function') return;

    setProjects((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const newId = newProject.id ?? newProject._id;
      const exists =
        newId != null &&
        list.some((p) => String(p.id ?? p._id) === String(newId));

      return exists ? list : [newProject, ...list];
    });
  };

  return {
    handleProjectCreated,
  };
}