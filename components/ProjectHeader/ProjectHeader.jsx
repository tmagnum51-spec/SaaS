'use client';
import { useState } from 'react';
import styles from './ProjectHeader.module.css';

// On retire l'import de Kanban pour l'instant

export default function DashboardHeader({ tasks, user }) {

  const fullName = user?.name || 'Utilisateur'; 
    // 1. Déclaration de l'état pour contrôler l'ouverture de la modale (fermée par défaut)
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div className={styles.headerTop}>
          <div className={styles.headerText}>
            <h1 className={styles.DashboardTitle}>             
            Mes projets
            </h1>
            <h2 className={styles.welcomeTitle}>  
              Gérez vos projets 
            </h2>
          </div>
          <button 
                onClick={() => setIsModalOpen(true)} 
                className={styles.openButton}
            >
                + Créer un projet
          </button>

        </div>
      </div>
        
      

      
    </>
  );
}