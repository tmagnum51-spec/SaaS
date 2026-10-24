import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
 return (
   <nav className={styles.footer}>
     <div className={styles.menu}>
       <li>
        <Link href="/" className={styles.logo}>
            ABRICOT
        </Link>
       </li>

       
         <li>
           <Link href="/" className={styles.copyright}>
             Abricot 2025
           </Link>
         </li>
        </div>
    </nav>
     
   
 )
}