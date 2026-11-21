'use client';
import { useState } from 'react';
import styles from './TaskKanban.module.css';
import TaskCard from '../TaskCard/TaskCard';

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
          {todoTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Colonne En cours */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h3>En cours</h3>
          <span className={styles.columnCount}>{inProgressTasks.length}</span>
        </div>
        <div className={styles.cardsWrapper}>
          {inProgressTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Colonne Terminées */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h3>Terminées</h3>
          <span className={styles.columnCount}>{doneTasks.length}</span>
        </div>
        <div className={styles.cardsWrapper}>
          {doneTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}