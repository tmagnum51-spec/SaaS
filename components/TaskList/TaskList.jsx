import styles from './TaskList.module.css';

export default function TaskList({ tasks }) {
  // 1. Si le tableau est vide ou inexistant, on affiche le message et on STOPPE tout ici
  console.log("🔍 [DEBUG TaskList] Tasks reçues :", tasks);
  if (tasks === undefined) {
    return <p className={styles.noTasks}>Chargement des tâches...</p>;
  }
  if (tasks ===0) {
    return <p className='{styles.noTasks}'> Aucune tache assignées</p>
  }

  

  // 2. Si on arrive ici, c'est qu'il y a des tâches : on affiche la liste normalement
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
                    <span>📁 Projet ID: {task.projectId ? task.projectId.slice(0, 6) + '...' : 'Général'}</span>
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