import { getInitials } from '@/app/utils/getInitials';
import styles from './ProjectsList.module.css';
import Link from 'next/link';


export default function ProjectsList({ projects }) {
  // 1. Si le tableau est vide ou inexistant, on affiche le message et on STOPPE tout ici
  console.log("🔍 [DEBUG TaskList] Tasks reçues ici :", projects);
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
          
          const totalTasks = project.totalTasks ?? 0;
          const completedTasks = project.completedTasks ?? 0;
          const progressPercentage = totalTasks > 0
  ? Math.round((completedTasks / totalTasks) * 100)
  : 0;;

          return (
            <Link 
            key={project.id}
            href={`/projects/${project.id}`} 
            className={styles.projectCard}>
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
                    {completedTasks}/{totalTasks} tâches terminées
                  </span>
                </div>

              

                {/* Pied de carte : Équipe et Membres / Rôles */}
                <div className={styles.cardFooter}>
                  <div className={styles.teamLabel}>
                    👥 Équipe ({project.members ? project.members.length : 0})
                  </div>
                  <div className={styles.membersList}>
                    {/* Propriétaire */}
                    <div className={styles.InitialsBadgeOwner}>
                      <span className={styles.avatarOwnerInitials}>
                        {getInitials(project.owner?.name)}
                      </span>
                    </div>
                    <div className={styles.memberBadgeOwner}>
                      <span className={styles.roleText}>Propriétaire</span>
                    </div>

                    {/* Autres membres */}
                    {project.members && project.members.map((member) => {
                      // Évite de réafficher le propriétaire s'il est déjà dans members
                      if (member.user?.id === project.owner?.id) return null;
                      
                      const memberName = member.user?.name 
                       
                      return (
                        <div key={member.id} className={styles.memberBadge}>
                          <span className={styles.avatarInitials}>{getInitials(memberName)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}