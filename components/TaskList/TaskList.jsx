import TaskCard from '../TaskCard/TaskCard';
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
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}