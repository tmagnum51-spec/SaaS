'use client';

import { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import styles from './TaskList.module.css';

export default function TaskList({ tasks }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (tasks === undefined) {
    return <p className={styles.noTasks}>Chargement des tâches...</p>;
  }

  if (tasks.length === 0) {
    return <p className={styles.noTasks}>Aucune tâche assignée</p>;
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    if (!normalizedQuery) return true;
    const titleMatch = task.title?.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = task.description?.toLowerCase().includes(normalizedQuery);
    return titleMatch || descriptionMatch;
  });

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.sectionTitle}>Mes tâches assignées</h2>
          <p className={styles.sectionSubtitle}>Par ordre de priorité</p>
        </div>

        <div className={styles.searchWrapper}>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Rechercher une tâche"
    aria-label="Rechercher une tâche"
    className={styles.searchInput}
  />
  <svg
    className={styles.searchIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
</div>
      </div>

      <div className={styles.cardsWrapper}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className={styles.noTasks}>Aucune tâche ne correspond à la recherche</p>
        )}
      </div>
    </div>
  );
}