import { Suspense } from 'react';
import { cookies } from 'next/headers';
import TaskList from '@/components/TaskList/TaskList';
import styles from './page.module.css';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';

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
async function fetchUserTasks(token) {
  const res = await fetch('http://localhost:8000/dashboard/assigned-tasks', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  console.log("Données utilisateur reçues :", json);
  return json?.data?.tasks || []; // On extrait directement le tableau grâce au JSON fourni
}

async function DashboardContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <p>Veuillez vous connecter pour accéder au tableau de bord.</p>;
  }

  // On lance les deux requêtes en parallèle pour gagner du temps
  const [user, tasks] = await Promise.all([
    fetchUserData(token),
    fetchUserTasks(token),
  ]);
console.log("CE QUE CONTIENT 'user' :", user);
  const fullName = user?.name || 'Utilisateur par déf';

  return (
    <DashboardHeader tasks={tasks} user={user} />
  
    // <div className={styles.dashboardContainer}>
    //   <h1 className={styles.welcomeTitle}>
    //     Bonjour {fullName}, voici un aperçu de vos projets et tâches
    //   </h1>
      
    //   {/* On passe le tableau de tâches propre au composant TaskList */}
    //   {/* <TaskList tasks={tasks} /> */}
    // </div>
  );
}

export default function DashboardPage() {
    
  return (
    <main className={styles.mainContainer}>
      <Suspense fallback={<p className={styles.loading}>Chargement du tableau de bord...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}