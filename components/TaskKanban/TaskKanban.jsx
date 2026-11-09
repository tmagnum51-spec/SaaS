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
              <span>📁 Projet ID: {task.projectId ? task.projectId.slice(0, 6) + '...' : 'Général'}</span>
              <span>📅 {formattedDate}</span>
              <span>💬 {task.comments ? task.comments.length : 0}</span>
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