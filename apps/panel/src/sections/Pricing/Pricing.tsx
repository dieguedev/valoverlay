import { Link } from 'react-router-dom'
import styles from './Pricing.module.scss'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0€',
    period: 'para siempre',
    features: [
      'Overlay básico para OBS',
      'Número limitado de estadísticas simultáneas',
      'Personalización básica de posición',
    ],
    cta: 'Empezar gratis',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '20€',
    period: 'al mes',
    features: [
      'Más estadísticas y widgets simultáneos en tu overlay',
      'Personalización visual avanzada: temas, colores, marca propia y sin marca de agua de ValoVerlay',
      'Acceso anticipado al futuro editor drag & drop de posicionamiento libre',
    ],
    cta: 'Empezar con Pro',
    highlighted: true,
  },
]

export const Pricing: React.FC = () => {
  return (
    <section className={styles.pricing}>
      <h2 className={styles.title}>Planes</h2>
      <div className={styles.grid}>
        {plans.map((plan) => (
          <article
            key={plan.id}
            aria-labelledby={`plan-${plan.id}`}
            className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
          >
            <h3 id={`plan-${plan.id}`} className={styles.planName}>
              {plan.name}
            </h3>
            <p className={styles.price}>
              <span className={styles.amount}>{plan.price}</span>{' '}
              <span className={styles.period}>{plan.period}</span>
            </p>
            <ul className={styles.features}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link to="/register" className={styles.cta}>
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
