import { cookies } from 'next/headers';

async function fetchUserProfile(token) {
  try {
    const res = await fetch('http://localhost:5000/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`, // Adaptez selon votre backend
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Mon Profil Utilisateur</h1>
      <p>Bienvenue dans votre espace sécurisé.</p>
    </main>
  );
}