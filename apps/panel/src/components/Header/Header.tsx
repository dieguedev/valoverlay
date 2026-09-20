import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Valoverlay
      </Link>
      <nav className={styles.actions}>
        <Link to="/login" className={styles.loginLink}>
          Iniciar sesión
        </Link>
        <Link to="/register" className={styles.registerLink}>
          Crear cuenta
        </Link>
      </nav>
    </header>
  )
}
