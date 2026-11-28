'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { modifyProject } from '@/app/service/api';
import ModalWrapper from './ModalWrapper';
import styles from './ModifyProjectModal.module.css';

export default function ModifyProjectModal({
  isOpen,
  onClose,
  projectId,
  project,
  onProjectUpdated,
}) {
  const { token } = useAuth();
  const targetProjectId = project?.id ?? projectId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !project) return;

    setName(project.name ?? '');
    setDescription(project.description ?? '');
    setError('');
  }, [isOpen, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetProjectId || submitting) return;

    if (!name.trim()) {
      setError('Le nom du projet est obligatoire.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      const updatedProject = await modifyProject(targetProjectId, payload, token);

      onProjectUpdated?.({
        ...project,
        ...payload,
        ...updatedProject,
      });
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Erreur lors de la modification du projet.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !project) return null;

  const isFormValid = name.trim().length > 0 && description.trim().length > 0;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier le projet"
      className={styles.projectModalCard}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="project-name" className={styles.label}>
            Titre*
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="project-description" className={styles.label}>
            Description*
          </label>
          <input
            id="project-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !isFormValid}
          >
            {submitting ? 'Modification...' : 'Modifier le projet'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}