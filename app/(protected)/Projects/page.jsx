import { Suspense } from 'react';
import { cookies } from 'next/headers';
import ProjectsList from '@/components/Projects/Projects';
import styles from './page.module.css';
import ProjectHeader from '@/components/ProjectHeader/ProjectHeader';

async function fetchUserData(token) {
  const res = await fetch('http://localhost:8000/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  
  
  return json?.data?.user || null; 
}

// Fonction pour récupérer les tâches
async function fetchUserProjects(token) {
  const res = await fetch('http://localhost:8000/projects', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  console.log("Données utilisateur reçues :", json);
  return json?.data?.projects || []; // On extrait directement le tableau grâce au JSON fourni
}

async function ProjectsContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <p>Veuillez vous connecter pour accéder aux projets.</p>;
  }

  // On lance les deux requêtes en parallèle pour gagner du temps
  const [user, projects] = await Promise.all([
    fetchUserData(token),
    fetchUserProjects(token),
  ]);
console.log("CE QUE CONTIENT 'user' :", user);
  const fullName = user?.name || 'Utilisateur par défaut';

  return (
    <ProjectsHeader projects={projects} user={user} />
  
    // <div className={styles.dashboardContainer}>
    //   <h1 className={styles.welcomeTitle}>
    //     Bonjour {fullName}, voici un aperçu de vos projets et tâches
    //   </h1>
      
    //   {/* On passe le tableau de tâches propre au composant TaskList */}
    //   {/* <TaskList tasks={tasks} /> */}
    // </div>
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