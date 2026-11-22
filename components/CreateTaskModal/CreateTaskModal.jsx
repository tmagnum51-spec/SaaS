'use client';
import { useState } from 'react';
import styles from './CreateTaskModal.module.css';

export default function CreateTaskModal({ isOpen, onClose }) {
const [taskTitle, setTaskTitle] = useState('');
const [taskDescription, setTaskDescription] = useState('');
const [selectedAssignee, setSelectedAssignee] = useState(''); // Pour le menu déroulant


const assigneeList = [
    { id: 1, name: 'Thomas Chabrier' },
    { id: 2, name: 'Alice Martin' },
    { id: 3, name: 'Jean Dupont' },
  ];

  if (!isOpen) return null; // Si la modale est fermée, on ne rend rien

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Les données à envoyer au backend
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      assigneeId: selectedAssignee,
    };
    // Votre logique pour envoyer le POST vers votre API backend ici
    console.log("Création de la tache :", taskName);
    onClose(); // Ferme la modale après validation
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>        
            <h2>Créer une nouvelle tâche</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <label className={styles.label}>Titre*</label>
                <input 
                    type="text" 
                    placeholder="" 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className={styles.input} 
                />
            <label className={styles.label}>Description*</label>
                <input 
                    type="text" 
                    placeholder="" 
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className={styles.input} 
                />
            <label className={styles.label}>Contributeur</label>
                <select 
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className={styles.input} // Vous pouvez réutiliser la même classe CSS pour l'harmoniser
            >
                <option value="">Choisir un ou plusieurs collaborateurs</option>
                {assigneeList.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                </option>
                ))}
                </select>

                
            <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Annuler
                </button>
                <button type="submit" className={styles.submitBtn}>
                Ajouter une Tâche
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}