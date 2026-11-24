'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getAllUsers } from '@/app/service/api';
import styles from './CreateProjectModal.module.css';
import ContributorChip from '../contributorBadges/ContributorChip';

export default function ContributorSelector({
  label = 'Contributeurs',
  selectedIds = [],
  onChange,
  placeholder = 'Choisir un collaborateur à ajouter',
  disabled = false,
}) {
  const { token } = useAuth();
  const [contributorsList, setContributorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    getAllUsers(token)
      .then((users) => {
        if (isMounted) {
          setContributorsList(users);
        }
      })
      .catch((err) => {
        console.error('Erreur chargement contributeurs :', err);
        if (isMounted) {
          setError('Impossible de charger la liste des contributeurs.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSelectChange = (e) => {
    const id = e.target.value;
    if (!id) return;

    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
  };

  const handleRemove = (idToRemove) => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  const selectedUsers = contributorsList.filter((user) =>
    selectedIds.includes(user.id)
  );

  // On peut soit garder tous les utilisateurs dans le <select>, soit masquer ceux déjà ajoutés
  const availableUsers = contributorsList.filter(
    (user) => !selectedIds.includes(user.id)
  );

  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}

      <select
        value=""
        onChange={handleSelectChange}
        className={styles.input}
        disabled={disabled || loading}
      >
        <option value="">
          {loading ? 'Chargement des collaborateurs...' : placeholder}
        </option>
        {availableUsers.map((contributor) => (
          <option key={contributor.id} value={contributor.id}>
            {contributor.name || contributor.email}
          </option>
        ))}
      </select>

      {selectedUsers.length > 0 && (
        <div className={styles.selectedChips}>
            {selectedUsers.map((user) => (
            <ContributorChip
                key={user.id}
                name={user.name || user.email}
                disabled={disabled}
                onRemove={() => handleRemove(user.id)}
            />
            ))}
        </div>
        )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}