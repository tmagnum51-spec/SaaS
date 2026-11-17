'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //fonction de fetch encapsulée
  const fetchUserData = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data?.user || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      return null;
    }
  };

  // Au chargement de l'application, on vérifie si un token existe
  useEffect(() => {
    const initAuth = async () => {
      // Par exemple, si vous stockez le token dans le localStorage après le login
      const token = localStorage.getItem('token'); 
      
      if (token) {
        const userData = await fetchUserData(token);
        setUser(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour consommer facilement le contexte partout
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}