import { Link } from 'react-router-dom'
import styles from './Footer.module.scss'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <Link to="/privacy" className={styles.link}>
          Política de privacidad
        </Link>
        <Link to="/terms" className={styles.link}>
          Términos y condiciones
        </Link>
      </nav>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Valoverlay
      </p>
    </footer>
  )
}
