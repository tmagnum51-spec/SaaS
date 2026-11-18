'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction centralisée pour récupérer le profil utilisateur
  const fetchUser = async () => {
    try {
      // On appelle une route Next.js (ou directement Express si le CORS/Proxy est géré)
      // Si votre API Express gère les cookies avec credentials: 'include' :
      const res = await fetch('http://localhost:8000/auth/profile', {
        credentials: 'include', // 👈 Indispensable pour envoyer le cookie HttpOnly vers Express
        cache: 'no-store',
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const json = await res.json();
      const userData = json?.data?.user || json?.user || null;
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}