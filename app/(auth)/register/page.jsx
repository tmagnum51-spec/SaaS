import Link from 'next/link';
import styles from './page.module.css';
import RegisterForm from '@/components/RegisterForm/RegisterForm';

export default function RegisterPage() {
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
          <h1 className={styles.title}>Inscription</h1>
          
          {/* Formulaire de connexion */}
          <RegisterForm />
          <p className={styles.footerText}>
            Déjà inscrit ? <Link href="/" className={styles.link}>Se connecter</Link>
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