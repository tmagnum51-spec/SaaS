'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createTask } from '@/app/service/api';
import ModalWrapper from './ModalWrapper';
import ContributorSelector from './ContributorSelector';
import styles from './CreateTaskModal.module.css';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'faible', variant: 'low' },
  { value: 'MEDIUM', label: 'moyenne', variant: 'medium' },
  { value: 'HIGH', label: 'Haute', variant: 'high' },
];

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  allowedUserIds,
  onTaskCreated,
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

  const resetAndClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssigneeIds([]);
    setPriority('MEDIUM')
    setError('');
    onClose();
  };

  const toUtcIsoString = (dateInput) => {
    if (!dateInput) return undefined;
    const [year, month, day] = dateInput.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      dueDate: toUtcIsoString(dueDate),
      priority, 
      assigneeIds,
    };

    try {
      const createdTask = await createTask(projectId, newTask, token);
      onTaskCreated?.(createdTask);
      resetAndClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la tâche.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Boolean(dueDate);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Créer une tâche"
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
            {submitting ? 'Ajout...' : '+ Ajouter une tâche'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}