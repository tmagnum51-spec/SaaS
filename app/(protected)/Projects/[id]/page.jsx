'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import styles from './page.module.css';
import TaskCardProject from '@/components/TaskCardProject/TaskCardProject';
import ProjectHeader from '@/components/ProjectHeader/ProjectHeader';

export default function ProjectPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !id) return;

    async function loadTasks() {
      setLoadingTasks(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Erreur serveur (${res.status})`);
        }

        const json = await res.json();
        const taskList = Array.isArray(json?.data?.tasks) ? json.data.tasks : [];
        setTasks(taskList);
      } catch (err) {
        console.error('Erreur chargement tâches projet :', err);
        setError('Impossible de charger les tâches du projet.');
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, [id, authLoading, user]);

  if (authLoading || loadingTasks) {
    return <p className={styles.noTasks}>Chargement du projet...</p>;
  }

  if (error) {
    return <p className={styles.noTasks}>{error}</p>;
  }



  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
  const statusMatch =
    statusFilter === 'ALL' || task.status === statusFilter;

  if (!statusMatch) return false;
  if (!normalizedQuery) return true;

  const titleMatch = task.title?.toLowerCase().includes(normalizedQuery);
  const descriptionMatch = task.description?.toLowerCase().includes(normalizedQuery);
  return titleMatch || descriptionMatch;
});

  return (
    <>


      <div>
        <ProjectHeader />
      </div>
    <div className={styles.taskBarContainer}>
      <div className={styles.taskListContainer}>
        <div className={styles.headerSection}>
          <div>
            <h2 className={styles.sectionTitle}>Tâches du projet</h2>
            <p className={styles.sectionSubtitle}>
              Par ordre de priorité{/* {completedCount} / {tasks.length} terminées ({progressPercent}%) */}
            </p>
            </div>
           <div className={styles.controlsGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
              className={styles.statusSelect}
            >
              <option value="ALL">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>

            <div className={styles.searchBar}>
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
          
        </div>
          
       {filteredTasks.length === 0 ? (
        <p className={styles.noTasks}>Aucune tâche assignée pour ce projet.</p>
        ) : (
        <div className={styles.cardsWrapper}>
          {filteredTasks.map((task) => (
            <TaskCardProject key={task.id} task={task} />
          ))}
        </div>
      )}
      </div>
    </div>
    </>
  );
}