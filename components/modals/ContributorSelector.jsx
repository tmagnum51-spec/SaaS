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
  onSelectedUsersChange,
  allowedIds = null,
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
    onChange(selectedIds.filter((id) => String(id) !== String(idToRemove)));
  };

  const normalizedAllowedIds = Array.isArray(allowedIds)
    ? allowedIds.map(String)
    : null;

  const normalizedSelectedIds = selectedIds.map(String);

  const eligibleUsers = normalizedAllowedIds
    ? contributorsList.filter((user) =>
        normalizedAllowedIds.includes(String(user.id))
      )
    : contributorsList;

  const selectedUsers = eligibleUsers.filter((user) =>
    normalizedSelectedIds.includes(String(user.id))
  );
  useEffect(() => {
    onSelectedUsersChange?.(selectedUsers);
  }, [selectedUsers, onSelectedUsersChange]);

  const availableUsers = eligibleUsers.filter(
    (user) => !normalizedSelectedIds.includes(String(user.id))

    
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