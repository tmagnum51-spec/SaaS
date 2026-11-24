'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createProjects } from '@/app/service/api';
import ModalWrapper from './ModalWrapper';
import ContributorSelector from './ContributorSelector';
import styles from './CreateProjectModal.module.css';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { token } = useAuth();

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedContributorIds, setSelectedContributorIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetAndClose = () => {
    setProjectTitle('');
    setProjectDescription('');
    setSelectedContributorIds([]);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    const newProject = {
      name: projectTitle.trim(),
      description: projectDescription.trim(),
      memberIds: selectedContributorIds,
    };

    try {
      const createdProject = await createProjects(newProject, token);
      onProjectCreated?.(createdProject);
      resetAndClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du projet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Créer un nouveau projet"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Titre*</label>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className={styles.input}
          required
        />

        <label className={styles.label}>Description*</label>
        <input
          type="text"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className={styles.input}
          required
        />

        <ContributorSelector
          label="Contributeurs"
          selectedIds={selectedContributorIds}
          onChange={setSelectedContributorIds}
        />

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={resetAndClose}
            className={styles.cancelBtn}
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Ajout...' : 'Ajouter un projet'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}