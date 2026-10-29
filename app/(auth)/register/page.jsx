import Link from 'next/link';
import styles from './page.module.css';
import LoginForm from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Colonne de gauche (Formulaire) */}
      <div className={styles.leftSection}>
        <div className={styles.header}>
          <svg className={styles.logo} width="147" height="19" viewBox="0 0 147 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M93.8848 0.337891..." fill="#D3590B"/>
          </svg>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Connexion</h1>
          
          {/* Formulaire de connexion */}
          <LoginForm />

          <p className={styles.footerText}>
            Pas encore de compte ? <Link href="/register" className={styles.link}>S'inscrire</Link>
          </p>
        </div>

        <div />
      </div>

      {/* Colonne de droite (Image illustrative) */}
      <div 
        className={styles.rightSection} 
        style={{ backgroundImage: `url('/assets/img/login.jpg')` }} 
      />
    </div>
  );
}