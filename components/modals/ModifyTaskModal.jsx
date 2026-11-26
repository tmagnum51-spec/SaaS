'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { modifyTask } from '@/app/service/api';
import ModalWrapper from './ModalWrapper';
import ContributorSelector from './ContributorSelector';
import styles from './ModifyTaskModal.module.css';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'faible', variant: 'low' },
  { value: 'MEDIUM', label: 'moyenne', variant: 'medium' },
  { value: 'HIGH', label: 'Haute', variant: 'high' },
];

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminée' },
];

const toUtcIsoString = (dateInput) => {
  if (!dateInput) return undefined;
  const [year, month, day] = dateInput.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

const extractAssigneeIds = (taskItem) => {
  const rawList = Array.isArray(taskItem?.assignees)
    ? taskItem.assignees
    : Array.isArray(taskItem?.assigneeIds)
      ? taskItem.assigneeIds
      : Array.isArray(taskItem?.assignedUsers)
        ? taskItem.assignedUsers
        : [];

  return rawList
    .map((item) => {
      if (item == null) return null;
      if (typeof item === 'object') {
        return item.userId ?? item.user?.id ?? item.id ?? null;
      }
      return item;
    })
    .filter((id) => id != null)
    .map(String);
};

export default function ModifyTaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  allowedUserIds,
  onTaskModified,
}) {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !task) return;

    setTitle(task.title ?? '');
    setDescription(task.description ?? '');
    setDueDate(task.dueDate ? String(task.dueDate).slice(0, 10) : '');
    setStatus(task.status ?? 'TODO');
    setPriority(task.priority ?? 'MEDIUM');
    setAssigneeIds(extractAssigneeIds(task));
    setError('');
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task?.id || submitting) return;

    if (!title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: toUtcIsoString(dueDate),
      assigneeIds,
    };

    try {
      const response = await modifyTask(projectId, task.id, payload, token);
      const modifiedTask = response?.data?.task ?? response?.task ?? response;

      onTaskModified?.(modifiedTask);
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Erreur lors de la modification.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !task) return null;

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Boolean(dueDate);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier une tâche"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="task-title" className={styles.label}>
            Titre*
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="task-description" className={styles.label}>
            Description*
          </label>
          <input
            id="task-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="task-due-date" className={styles.label}>
            Échéance*
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="task-status" className={styles.label}>
            Statut :
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.input}
            disabled={submitting}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <ContributorSelector
          label="Assigné à :"
          selectedIds={assigneeIds}
          allowedIds={allowedUserIds}
          onChange={setAssigneeIds}
          placeholder="Choisir un ou plusieurs collaborateurs"
          disabled={submitting}
        />

        <div className={styles.fieldGroup}>
          <span className={styles.label}>Priorité :</span>
          <div className={styles.priorityGroup} role="group" aria-label="priorité">
            {PRIORITY_OPTIONS.map((option) => {
              const isSelected = priority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  disabled={submitting}
                  aria-pressed={isSelected}
                  className={`${styles.priorityPill} ${styles[option.variant]} ${
                    isSelected ? styles.prioritySelected : styles.priorityUnselected
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !isFormValid}
          >
            {submitting ? 'Modifier...' : 'Modifier la tâche'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}