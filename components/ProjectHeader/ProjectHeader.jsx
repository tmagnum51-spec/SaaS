'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './ProjectHeader.module.css';
import { useAuth } from '@/app/context/AuthContext';
import { getProjectsByUser } from '@/app/service/api';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';

export default function ProjectHeader({ projectId }) {
  const params = useParams();
  const id = projectId ?? params?.id;

  const { loading: authLoading, token } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ownerName = project?.owner?.name || 'Propriétaire';
const otherMembers = (project?.members ?? []).filter(
  (member) => member.user?.id && member.user?.id !== project?.owner?.id
);
// Si project.owner n'est pas fourni à part, on peut compter project.members.length
const totalCount = project?.owner
  ? 1 + otherMembers.length
  : project?.members?.length ?? 0;

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    if (authLoading) return;

    let isMounted = true;

    async function loadProject() {
      setLoading(true);
      try {
        const projects = await getProjectsByUser(token);
        console.log('🔎 id URL :', id, '| projects reçus :', projects);
        const foundProject =
          projects?.find((p) => String(p.id) === String(id)) ?? null;
          console.log('🔎 foundProject :', foundProject);

        if (isMounted) {
          setProject(foundProject);
        }
      } catch (err) {
        console.error('Erreur chargement projet dans ProjectHeader :', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id, authLoading, token]);

  // N'affiche rien s'il n'y a pas d'id de projet
  if (!id) return null;

  if (loading) {
    return (
      <header className={styles.dashboardContainer}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.DashboardTitle}>Chargement...</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.dashboardContainer}>
      <div className={styles.headerTop}>
        <div>
          <div className={styles.TitleDescButton}>
            <div className={styles.TitleDesc}>
              <h1 className={styles.DashboardTitle}>
                {project?.name ?? 'Projet introuvable'}
              </h1>
              {project?.description && (
                <p className={styles.projectDescription}>{project.description}</p>
                
              )}
            </div>
            <button className={styles.openButton} onClick={() => setIsModalOpen(true)}>
              + Crée une tâche
            </button>
          </div>
          {/* On appelle la modale en lui passant l'état et de quoi la fermer */}
          <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} />

          <div className={styles.contributorsBar}>
            <div className={styles.contributorsLeft}>
              <span className={styles.contributorsLabel}>Contributeurs</span>
              <span className={styles.contributorsCount}>
                {totalCount} {totalCount <= 1 ? 'personne' : 'personnes'}
              </span>
            </div>  

            <div className={styles.contributorsRight}>
              {/* Propriétaire */}
              {project?.owner && (
                <div className={styles.ownerGroup}>
                  <span className={styles.ownerAvatar}>{getInitials(ownerName)}</span>
                  <span className={styles.ownerPill}>Propriétaire</span>
                </div>
              )}

              {/* Autres membres */}
              {otherMembers.map((member, index) => {
                const memberName =
                  member.user?.name?.trim() || member.user?.email || 'Membre';

                return (
                  <div
                    key={member.id ?? member.user?.id ?? index}
                    className={styles.memberGroup}
                  >
                    <span className={styles.memberAvatar}>{getInitials(memberName)}</span>
                    <span className={styles.memberPill}>{memberName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}