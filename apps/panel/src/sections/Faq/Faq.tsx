import { useState } from 'react'
import styles from './Faq.module.scss'

const questions = [
  {
    question: '¿Necesito vincular mi cuenta de Riot?',
    answer:
      'Sí, para que el overlay muestre tus datos reales de partida. Puedes crear tu cuenta de ValoVerlay primero y vincular Riot después, desde tu perfil.',
  },
  {
    question: '¿Es gratis?',
    answer:
      'Sí, el plan Free no tiene coste. El plan Pro añade más estadísticas simultáneas y personalización avanzada.',
  },
  {
    question: '¿Funciona con OBS?',
    answer:
      'Sí, el overlay se pega como Browser Source de OBS; no necesitas ningún plugin adicional.',
  },
  {
    question: '¿Puedo cancelar cuando quiera?',
    answer: 'Sí, no hay permanencia.',
  },
]

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={styles.faq}>
      <h2 className={styles.title}>Preguntas frecuentes</h2>
      <div className={styles.list}>
        {questions.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item.question} className={styles.item}>
              <h3 className={styles.heading}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.question}
                </button>
              </h3>
              {isOpen && (
                <p id={`faq-answer-${index}`} className={styles.answer}>
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
