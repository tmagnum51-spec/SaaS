'use client';
import { useState } from 'react';
import styles from './ProjectsHeader.module.css';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';

// On retire l'import de Kanban pour l'instant

export default function ProjectsHeader({ project }) {

  const projectName = project?.name || 'Projet'; 
    // 1. Déclaration de l'état pour contrôler l'ouverture de la modale (fermée par défaut)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectDisplay, setProjectDisplay] = useState('list');

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

            {/* On appelle la modale en lui passant l'état et de quoi la fermer */}
            <CreateProjectModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} />

        </div>
      </div>
        
      

      
    </>
  );
}