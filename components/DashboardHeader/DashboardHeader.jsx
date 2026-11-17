'use client';
import { useState } from 'react';
import styles from './DashboardHeader.module.css';
import TaskList from '../TaskList/TaskList';
import TaskKanban from '../TaskKanban/TaskKanban';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
// On retire l'import de Kanban pour l'instant

export default function DashboardHeader({ tasks, user }) {
  const [taskDisplay, setTaskDisplay] = useState('list');
  const fullName = user?.name || 'Utilisateur'; 

  // 1. Déclaration de l'état pour contrôler l'ouverture de la modale (fermée par défaut)
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.dashboardContainer}>
            <div className={styles.headerTop}>
                <div>
                    <h1 className={styles.DashboardTitle}> 
                        Tableau de bord
                    </h1>
                    {/* 2. Le bouton qui déclenche l'ouverture au clic */}
            
                    <h2 className={styles.welcomeTitle}>  
                    Bonjour {fullName}, voici un aperçu de vos projets et tâches
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
        
      

      <div className={styles.toolbar}>
        <button
            onClick={() => setTaskDisplay('list')}
            className={`${styles.button} ${taskDisplay === 'list' ? styles.active : ''}`}>
            Liste
        </button>
        <button 
            onClick={() => setTaskDisplay('kanban')}
            className={`${styles.button} ${taskDisplay === 'kanban' ? styles.active : ''}`}>
            Kanban
        </button>
      </div>

      <div className={styles.content}>
        {/* On affiche uniquement TaskList en attendant de créer le Kanban */}
        {taskDisplay === 'list' ? (
          <TaskList tasks={tasks} />
        ) : (
          (
          <TaskKanban tasks={tasks} />
        )
        )}
        </div>
      </div>
    </>
  );
}