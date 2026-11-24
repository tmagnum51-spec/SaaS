import { useState } from 'react';
import styles from './TaskCardProject.module.css';

export default function TaskCardProject({ task }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : 'Aucune date';

  const isInProgress = task.status === 'IN_PROGRESS';
  const isDone = task.status === 'DONE';
  const comments = task.comments ?? [];

  const toggleComments = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.taskTitle}>
              {task.title}
              <span
                className={`${styles.badge} ${
                  isInProgress ? styles.inProgress : isDone ? styles.done : styles.todo
                }`}
              >
                {isInProgress ? 'En cours' : isDone ? 'Terminé' : 'À faire'}
              </span>
            </h3>
            <p className={styles.taskDescription}>{task.description}</p>
          </div>
          <div className={styles.taskStatusBadge}></div>
        </div>

        <div className={styles.dateContainer}>
          <span className={styles.metaItem}>
            Échéance :{' '}
            <svg className={styles.calendarIcon} viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            {formattedDate}
          </span>
        </div>

        <div className={`${styles.cardFooter} ${isCommentsOpen ? styles.cardFooterExpanded : ''}`}>
          <div className={styles.footerTopRow}>
            <div className={styles.metaInfo}>
              <span>Commentaires : {comments.length}</span>
              <button
                type="button"
                className={styles.commentsToggleBtn}
                onClick={toggleComments}
                aria-expanded={isCommentsOpen}
                aria-label={isCommentsOpen ? 'Masquer les commentaires' : 'Afficher les commentaires'}
              >
                <svg
                  className={`${styles.chevron} ${isCommentsOpen ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          {isCommentsOpen && (
            <div className={styles.commentsPanel}>
              {comments.length > 0 ? (
                <ul className={styles.commentsList}>
                  {comments.map((comment, index) => {
                    const authorName =
                      typeof comment.author === 'string'
                        ? comment.author
                        : comment.author?.name || comment.author?.email || 'Utilisateur';

                    return (
                      <li key={comment.id ?? index} className={styles.commentItem}>
                        <span className={styles.commentAuthor}>{authorName}</span>
                        <p className={styles.commentText}>
                          {typeof comment === 'string' ? comment : comment.content ?? comment.text}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={styles.emptyComments}>Aucun commentaire pour le moment.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}