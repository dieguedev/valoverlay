import { Link } from 'react-router-dom'
import styles from './Hero.module.scss'

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Tu overlay de estadísticas de Valorant, listo para OBS en minutos
      </h1>
      <p className={styles.subtitle}>
        ValoVerlay conecta tu cuenta de Riot con un overlay en vivo para tus
        directos: KDA, rango, economía y más, actualizado en tiempo real
        mientras juegas.
      </p>
      <div className={styles.actions}>
        <Link to="/register" className={styles.primaryCta}>
          Crear cuenta gratis
        </Link>
        <a href="#como-funciona" className={styles.secondaryCta}>
          Ver cómo funciona
        </a>
      </div>
    </section>
  )
}
