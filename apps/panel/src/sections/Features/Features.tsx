import styles from './Features.module.scss'

const features = [
  {
    title: 'Overlay en vivo para OBS',
    description:
      'Pégalo como Browser Source y listo: sin login dentro de OBS, se identifica con una URL única y segura.',
  },
  {
    title: 'Panel de customización',
    description:
      'Elige qué estadísticas mostrar y en qué posición, sin tocar código.',
  },
  {
    title: 'Datos en tiempo real',
    description:
      'Mientras juegas, tus stats se actualizan solas en el overlay — no hace falta refrescar nada.',
  },
]

export const Features: React.FC = () => {
  return (
    <section className={styles.features}>
      <h2 className={styles.title}>Todo lo que necesitas para tu directo</h2>
      <div className={styles.grid}>
        {features.map((feature) => (
          <article key={feature.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardText}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
