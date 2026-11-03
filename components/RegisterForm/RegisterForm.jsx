'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css'; // Ajustez le chemin selon l'emplacement de votre fichier CSS

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  // Fonction utilitaire pour valider le format d'un e-mail
  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

     // 1. Vérification que les champs ne sont pas vides 
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // 2. Vérification que l'e-mail correspond bien au format 
    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Identifiants invalides');
      }

      // Redirection vers la page de profil protégée
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        
        {/* Affichage des erreurs géré via CSS Modules */}
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.inputGroup}>
          <label>Email :</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Mot de passe :</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password123!"
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Connexion en cours...' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}