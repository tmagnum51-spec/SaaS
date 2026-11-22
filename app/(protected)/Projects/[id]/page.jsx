'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import styles from './page.module.css';
import TaskCard from '@/components/TaskCard/TaskCard';
import ProjectHeader from '@/components/ProjectHeader/ProjectHeader';

export default function ProjectPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

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

  if (tasks.length === 0) {
    return <p className={styles.noTasks}>Aucune tâche assignée pour ce projet.</p>;
  }

  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <>


      <div>
        <ProjectHeader />
      </div>
    
      <div className={styles.taskListContainer}>
        <div className={styles.headerSection}>
          <div>
            <h2 className={styles.sectionTitle}>Tâches du projet</h2>
            <p className={styles.sectionSubtitle}>
              {completedCount} / {tasks.length} terminées ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className={styles.cardsWrapper}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </>
  );
}