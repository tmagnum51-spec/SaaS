import styles from './Projects.module.css';

export default function ProjectsList({ projects }) {
  // 1. Si le tableau est vide ou inexistant, on affiche le message et on STOPPE tout ici
  console.log("🔍 [DEBUG TaskList] Tasks reçues :", tasks);
  if (projects === undefined) {
    return <p className={styles.noTasks}>Chargement des projets...</p>;
  }
  if (projects ===0) {
    return <p className='{styles.noTasks}'> Aucun projet</p>
  }

  

  // 2. Si on arrive ici, c'est qu'il y a des projets : on affiche la liste normalement
  return (
    <div className={styles.taskListContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.sectionTitle}>Mes projets</h2>
          <p className={styles.sectionSubtitle}>Gérez vos projets</p>
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
        {projects.map((projects) => {
          const formattedDate = task.dueDate 
            ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) 
            : 'Aucune date';

          const isOwner = project.status === 'Propriétaire';
          const isDone = task.status === 'DONE';

          return (
            <div key={project.id} className={styles.taskCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.Title}>{task.title}</h3>
                    <p className={styles.taskDescription}>{task.description}</p>
                  </div>
                  
                  <span className={`${styles.badge} ${isOwner ? styles.inProgress : styles.todo}`}>
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