'use client';
import { useState } from 'react';
import styles from './ProjectHeader.module.css';

// On retire l'import de Kanban pour l'instant

export default function DashboardHeader({ tasks, user }) {

  const fullName = user?.name || 'Utilisateur'; 

  return (
    <>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.DashboardTitle}> 
         Mes projets

        </h1>
        <h2 className={styles.welcomeTitle}>  
          Gérez vos projets 
        </h2>
      </div>
        
      

      
    </>
  );
}