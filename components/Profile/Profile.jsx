'use client';

import { useState, useEffect } from 'react';
import styles from './Profile.module.css';

export default function Profile({ initialData }) {
  const userData = initialData?.user || initialData || {};

  // Découpage automatique du nom complet (ex: "Jean Dupont" -> Prénom: "Jean", Nom: "Dupont")
  const fullName = userData.name || userData.nomComplet || '';
  const spaceIndex = fullName.indexOf(' ');
  
  const defaultPrenom = spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
  const defaultNom = spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : '';

  const [nom, setNom] = useState(defaultNom);
  const [prenom, setPrenom] = useState(defaultPrenom);
  const [email, setEmail] = useState(userData.email || '');
  const [isEditing, setIsEditing] = useState(false);

  // Met à jour les champs si les données changent
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de mise à jour des informations si besoin
    setIsEditing(false);
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
            readOnly={!isEditing}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Prénom</label>
          <input
            type="text"
            className={styles.input}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing}
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

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.submitButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Enregistrer les modifications' : 'Modifier les informations'}
          </button>
        </div>
      </form>

      {/* Bouton de déconnexion */}
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