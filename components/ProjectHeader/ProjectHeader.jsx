'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './ProjectHeader.module.css';
import { useAuth } from '@/app/context/AuthContext';
import { getProjectsByUser } from '@/app/service/api';
import CreateTaskModal from '../modals/CreateTaskModal';
import ModifyProjectModal from '../modals/ModifyProjectModal';
import { getInitials } from '@/app/utils/getInitials';

export default function ProjectHeader({ projectId, onTaskCreated, onProjectUpdated }) {
  const params = useParams();
  const id = projectId ?? params?.id;

  const { loading: authLoading, token } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModalOpen, setActiveModalOpen] = useState(null);

  const ownerName = project?.owner?.name || 'Propriétaire';
  const otherMembers = (project?.members ?? []).filter(
    (member) => member.user?.id && member.user?.id !== project?.owner?.id
  );
  const totalCount = project?.owner
    ? 1 + otherMembers.length
    : project?.members?.length ?? 0;

  const projectMemberIds = [
    project?.owner?.id,
    ...(project?.members ?? []).map((member) => member.user?.id),
  ].filter(Boolean);

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

  const handleProjectUpdated = (updatedProject) => {
    if (updatedProject) {
      setProject((prev) => ({
        ...prev,
        ...updatedProject,
      }));
    }
    onProjectUpdated?.(updatedProject);
  };

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
                <button
                  type="button"
                  className={styles.modifyLink}
                  onClick={() => setActiveModalOpen('project')}
                >
                modifier
                </button>
              </h1>
              {project?.description && (
                <p className={styles.projectDescription}>{project.description}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.openButton}
              onClick={() => setActiveModalOpen('task')}
            >
              + Crée une tâche
            </button>
          </div>

          <ModifyProjectModal
            isOpen={activeModalOpen === 'project'}
            onClose={() => setActiveModalOpen(null)}
            project={project}
            onProjectUpdated={handleProjectUpdated}
          />

          <CreateTaskModal
            isOpen={activeModalOpen === 'task'}
            onClose={() => setActiveModalOpen(null)}
            projectId={id}
            allowedUserIds={projectMemberIds}
            onTaskCreated={onTaskCreated}
          />

          <div className={styles.contributorsBar}>
            <div className={styles.contributorsLeft}>
              <span className={styles.contributorsLabel}>Contributeurs</span>
              <span className={styles.contributorsCount}>
                {totalCount} {totalCount <= 1 ? 'personne' : 'personnes'}
              </span>
            </div>

            <div className={styles.contributorsRight}>
              {project?.owner && (
                <div className={styles.ownerGroup}>
                  <span className={styles.ownerAvatar}>{getInitials(ownerName)}</span>
                  <span className={styles.ownerPill}>Propriétaire</span>
                </div>
              )}

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