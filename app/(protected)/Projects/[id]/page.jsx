import { headers } from 'next/headers';
import styles from './page.module.css'; // Ajustez le chemin du CSS si besoin

// Fonction pour récupérer les tâches du projet depuis le backend
async function fetchProjectTasks(id) {
  try {
    const res = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
      headers: { cookie: headers().get('cookie') || '' },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    return [];
  }
}

export default async function ProjectPage({ params }) {
  // 1. On récupère l'id directement depuis l'URL dynamique
  const { id } = params;

  // 2. On va chercher les tâches de ce projet spécifique
  const tasks = await fetchProjectTasks(id);

  console.log("🔍 [DEBUG ProjectPage] Tasks reçues :", tasks);

  // 3. Gestion des états de chargement ou d'absence de tâches
  if (!tasks) {
    return <p className={styles.noTasks}>Chargement des tâches...</p>;
  }

  if (tasks.length === 0) {
    return <p className={styles.noTasks}>Aucune tâche assignée pour ce projet.</p>;
  }

  // 4. Affichage de la liste
  return (
    <div className={styles.taskListContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.sectionTitle}>Tâches du projet</h2>
          <p className={styles.sectionSubtitle}>Par ordre de priorité</p>
        </div>
        
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            placeholder="Rechercher une tâche" 
            className={styles.searchInput} 
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      <div className={styles.cardsWrapper}>
        {tasks.map((task) => {
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
                  
                  <span className={`${styles.badge} ${isInProgress ? styles.inProgress : styles.todo}`}>
                    {isInProgress ? 'En cours' : isDone ? 'Terminé' : 'À faire'}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.metaInfo}>
                    <span>📁 Projet ID: {id.slice(0, 6) + '...'}</span>
                    <span>📅 {formattedDate}</span>
                    <span>💬 {task.comments ? task.comments.length : 0}</span>
                  </div>
                  <button className={styles.viewButton}>Voir</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}