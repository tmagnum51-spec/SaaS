import { Suspense } from 'react';
import { cookies } from 'next/headers';
import ProjectsList from '@/components/Projects/ProjectsList';
import styles from './page.module.css';
import ProjectsHeader from '@/components/ProjectsHeader/ProjectsHeader';
import { getProjectsByUser } from '@/app/service/api';


// async function fetchUserData(token) {
//   const res = await fetch('http://localhost:8000/auth/profile', {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: 'no-store',
//   });
//   if (!res.ok) return null;
//   const json = await res.json();
  
  
//   return json?.data?.user || null; 
// }

// Fonction pour récupérer les projets
// async function fetchUserProjects(token) {
//   const res = await fetch('http://localhost:8000/projects', {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: 'no-store',
//   });
//   if (!res.ok) return null;
//   const json = await res.json();
//   console.log("Données utilisateur reçues :", json);
//   return json?.data?.projects || []; // On extrait directement le tableau grâce au JSON fourni
// }

//recupérer les taches par projet (terminé / total)
async function fetchProjectTasks(id) {
const res = await fetch(`http://localhost:8000/projects/${id}/tasks`)
 if (!res.ok) return null;
  const json = await res.json();
  console.log("Données de taches du projet reçues :", json);
  return json?.data?.tasks || [];
}

async function ProjectsContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <p>Veuillez vous connecter pour accéder aux projets.</p>;
  }

  // On lance les deux requêtes en parallèle pour gagner du temps
  const [projects] = await Promise.all([
    // fetchUserData(token),
    getProjectsByUser(token),
  ]);

//  const fullName = user?.name || 'Utilisateur par défaut';

  return (
    <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <ProjectsHeader />
        </div>  
      {/* Passage direct des projets au composant */}
      <ProjectsList projects={projects} />
    </div>
  );
}

export default function ProjectsPage() {
    
  return (
    <main className={styles.mainContainer}>
      <Suspense fallback={<p className={styles.loading}>Chargement des projets...</p>}>
        <ProjectsContent />
      </Suspense>
    </main>
  );
}