'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { updateProfile } from '@/app/service/api';
import styles from './Profile.module.css';

export default function Profile({ initialData, onProfileUpdated }) {
  const { token, updateUser } = useAuth(); // adapte selon ce que ton AuthContext expose
  const userData = initialData?.user || initialData || {};

  const fullName = userData.name || userData.nomComplet || '';
  const spaceIndex = fullName.indexOf(' ');

  const defaultPrenom = spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
  const defaultNom = spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : '';

  const [nom, setNom] = useState(defaultNom);
  const [prenom, setPrenom] = useState(defaultPrenom);
  const [email, setEmail] = useState(userData.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      const u = initialData.user || initialData;
      const nameStr = u.name || u.nomComplet || '';
      const idx = nameStr.indexOf(' ');

      setPrenom(idx !== -1 ? nameStr.substring(0, idx) : nameStr);
      setNom(idx !== -1 ? nameStr.substring(idx + 1) : '');
      setEmail(u.email || '');
    }
  }, [initialData]);

  const handleCancel = () => {
    const u = initialData?.user || initialData || {};
    const nameStr = u.name || u.nomComplet || '';
    const idx = nameStr.indexOf(' ');

    setPrenom(idx !== -1 ? nameStr.substring(0, idx) : nameStr);
    setNom(idx !== -1 ? nameStr.substring(idx + 1) : '');
    setEmail(u.email || '');
    setError('');
    setSuccessMessage('');
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing || saving) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    const combinedName = `${prenom.trim()} ${nom.trim()}`.trim();

    try {
      const updatedUser = await updateProfile(
        {
          name: combinedName,
          email: email.trim(),
        },
        token
      );

      if (updatedUser) {
        updateUser?.(updatedUser);
        onProfileUpdated?.(updatedUser);
      }

      setSuccessMessage('Profil mis à jour avec succès.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mon compte</h1>
        <p className={styles.subtitle}>{prenom} {nom}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nom</label>
          <input
            type="text"
            className={styles.input}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            readOnly={!isEditing || saving}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Prénom</label>
          <input
            type="text"
            className={styles.input}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            readOnly={!isEditing || saving}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing || saving}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input
            type="password"
            className={styles.input}
            value="••••••••••••"
            readOnly
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {successMessage && <p className={styles.successText}>{successMessage}</p>}

        <div className={styles.actions}>
          {!isEditing ? (
            <button
              type="button"
              className={styles.submitButton}
              onClick={() => {
                setError('');
                setSuccessMessage('');
                setIsEditing(true);
              }}
            >
              Modifier les informations
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </>
          )}
        </div>
      </form>

      <div className={styles.logoutContainer}>
        <form action="/api/logout" method="POST">
          <button type="submit" className={styles.logoutButton}>
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}