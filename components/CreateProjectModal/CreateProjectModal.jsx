'use client';
import { useState } from 'react';
import styles from './CreateProjectModal.module.css';

export default function CreateProjectModal({ isOpen, onClose }) {
const [projectTitle, setProjectTitle] = useState('');
const [projectDescription, setProjectDescription] = useState('');
const [selectedContributor, setSelectedContributor] = useState(''); // Pour le menu déroulant


const contributorsList = [
    { id: 1, name: 'Thomas Chabrier' },
    { id: 2, name: 'Alice Martin' },
    { id: 3, name: 'Jean Dupont' },
  ];

  if (!isOpen) return null; // Si la modale est fermée, on ne rend rien

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Les données à envoyer au backend
    const newProject = {
      title: projectTitle,
      description: projectDescription,
      contributorId: selectedContributor,
    };
    // Votre logique pour envoyer le POST vers votre API backend ici
    console.log("Création du projet :", projectName);
    onClose(); // Ferme la modale après validation
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>        
            <h2>Créer un nouveau projet</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <label className={styles.label}>Titre*</label>
                <input 
                    type="text" 
                    placeholder="" 
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className={styles.input} 
                />
            <label className={styles.label}>Description*</label>
                <input 
                    type="text" 
                    placeholder="" 
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className={styles.input} 
                />
            <label className={styles.label}>Contributeur</label>
                <select 
                value={selectedContributor}
                onChange={(e) => setSelectedContributor(e.target.value)}
                className={styles.input} // Vous pouvez réutiliser la même classe CSS pour l'harmoniser
            >
                <option value="">Choisir un ou plusieurs collaborateurs</option>
                {contributorsList.map((contributor) => (
                <option key={contributor.id} value={contributor.id}>
                    {contributor.name}
                </option>
                ))}
                </select>

                
            <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Annuler
                </button>
                <button type="submit" className={styles.submitBtn}>
                Ajouter un projet
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}