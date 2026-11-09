import styles from './ProjectsList.module.css';

export default function ProjectsList({ projects }) {
  // 1. Si le tableau est vide ou inexistant, on affiche le message et on STOPPE tout ici
  console.log("🔍 [DEBUG TaskList] Tasks reçues :", projects);
  if (projects === undefined) {
    return <p className={styles.noTasks}>Chargement des projets...</p>;
  }
  if (projects.length ===0) {
    return <p className={styles.noTasks}> Aucun projet</p>
  }

  

  // 2. Si on arrive ici, c'est qu'il y a des projets : on affiche la liste normalement
  return (
    <div className={styles.projectscontainer}>
      
      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          // Exemple de calcul ou valeurs par défaut si les tâches ne sont pas encore gérées dans l'API projets
          const completedTasksCount = 0; 
          const totalTasksCount = 2;
          const progressPercentage = 0;

          return (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardContent}>
                
                {/* En-tête : Titre et Description */}
                <div className={styles.headerSection}>
                  <h3 className={styles.projectTitle}>{project.name}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                </div>

                {/* Section Progression */}
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span>Progression</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className={styles.progressBarBackground}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.tasksCountText}>
                    {completedTasksCount}/{totalTasksCount} tâches terminées
                  </span>
                </div>

                {/* Pied de carte : Équipe et Membres / Rôles */}
                <div className={styles.cardFooter}>
                  <div className={styles.teamLabel}>
                    👥 Équipe ({project.members ? project.members.length : 0})
                  </div>
                  <div className={styles.membersList}>
                    {/* Propriétaire */}
                    <div className={styles.memberBadgeOwner}>
                      <span className={styles.avatarInitials}>
                        {project.owner?.name ? project.owner.name.substring(0, 2).toUpperCase() : 'AD'}
                      </span>
                      <span className={styles.roleText}>Propriétaire</span>
                    </div>

                    {/* Autres membres */}
                    {project.members && project.members.map((member) => {
                      // Évite de réafficher le propriétaire s'il est déjà dans members
                      if (member.user?.id === project.owner?.id) return null;
                      
                      const initials = member.user?.name 
                        ? member.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) 
                        : 'MC';

                      return (
                        <div key={member.id} className={styles.memberBadge}>
                          <span className={styles.avatarInitials}>{initials}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}