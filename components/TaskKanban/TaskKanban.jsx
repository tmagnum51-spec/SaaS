'use client';
import { useState } from 'react';
import styles from './TaskKanban.module.css';

export default function Kanban({ tasks }) {
  // 1. Gestion du chargement et du tableau vide
  console.log("🔍 [DEBUG Kanban] Tasks reçues :", tasks);
  
  if (tasks === undefined) {
    return <p className={styles.noTasks}>Chargement des tâches...</p>;
  }
  
  if (!tasks || tasks.length === 0) {
    return <p className={styles.noTasks}>Aucune tâche assignée pour le moment.</p>;
  }

  // 2. Filtrage des tâches pour les 3 colonnes du Kanban
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(task => task.status === 'DONE');

  // Fonction de rendu d'une carte (avec les variables définies au bon endroit)
  const renderTaskCard = (task) => {
    const formattedDate = task.dueDate 
      ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) 
      : 'Aucune date';

    const isInProgress = task.status === 'IN_PROGRESS';
    const isDone = task.status === 'DONE';

    return (
      <div key={task.id} className={styles.taskCard}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskDescription}>{task.description}</p>
            </div>
            
            <span className={`${styles.badge} ${isInProgress ? styles.inProgress : isDone ? styles.done : styles.todo}`}>
              {isInProgress ? 'En cours' : isDone ? 'Terminé' : 'À faire'}
            </span>
          </div>

          <div className={styles.cardFooter}>
  <div className={styles.metaInfo}>
    {/* Icône Dossier */}
    <span className={styles.metaItem}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      </svg>
      {task.title ? task.title.slice(0, 12) + '...' : 'Général'}
    </span>

    {/* Icône Calendrier */}
    <span className={styles.metaItem}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
      {formattedDate}
    </span>

    {/* Icône Message / Bulle */}
    <span className={styles.metaItem}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
      {task.comments ? task.comments.length : 0}
    </span>
  </div>

  <button className={styles.viewButton}>Voir</button>
</div>
        </div>
      </div>
    );
  };

  // 3. Affichage du Kanban à 3 colonnes
  return (
    <div className={styles.kanbanBoard}>
      {/* Colonne À faire */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h3>À faire</h3>
          <span className={styles.columnCount}>{todoTasks.length}</span>
        </div>
        <div className={styles.cardsWrapper}>
          {todoTasks.map(task => renderTaskCard(task))}
        </div>
      </div>

      {/* Colonne En cours */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h3>En cours</h3>
          <span className={styles.columnCount}>{inProgressTasks.length}</span>
        </div>
        <div className={styles.cardsWrapper}>
          {inProgressTasks.map(task => renderTaskCard(task))}
        </div>
      </div>

      {/* Colonne Terminées */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h3>Terminées</h3>
          <span className={styles.columnCount}>{doneTasks.length}</span>
        </div>
        <div className={styles.cardsWrapper}>
          {doneTasks.map(task => renderTaskCard(task))}
        </div>
      </div>
    </div>
  );
}