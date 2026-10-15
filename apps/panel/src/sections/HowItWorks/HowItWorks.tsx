import styles from './HowItWorks.module.scss'

const steps = [
  {
    title: 'Regístrate en ValoVerlay',
    description: 'Con email y contraseña o con Google.',
  },
  {
    title: 'Vincula tu cuenta de Riot',
    description: 'Autoriza el acceso a tus datos de partida desde tu perfil.',
  },
  {
    title: 'Configura tu overlay',
    description: 'Elige qué estadísticas mostrar y dónde.',
  },
  {
    title: 'Pégalo en OBS',
    description: 'Copia tu URL única como Browser Source y empieza a streamear.',
  },
]

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className={styles.howItWorks}>
      <h2 className={styles.title}>Cómo funciona</h2>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
