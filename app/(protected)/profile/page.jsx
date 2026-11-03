import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Profile from '@/components/Profile/Profile';
import styles from '@/components/Profile/Profile.module.css';

async function fetchUserData(token) {
  try {
    const res = await fetch('http://localhost:8000/auth/profile', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    
    // Le backend renvoie { success: true, data: { email: "...", ... } }
    return data.data || null; 
  } catch (error) {
    return null;
  }
}

// Composant interne qui lit les cookies et récupère les données
async function ProfileContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const user = token ? await fetchUserData(token) : null;

  return <Profile initialData={user} />;
}

// Page principale avec Suspense
export default function ProfilePage() {
  return (
    <main className={styles.mainContainer}>
      <Suspense fallback={<p className={styles.loading}>Chargement du profil...</p>}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}