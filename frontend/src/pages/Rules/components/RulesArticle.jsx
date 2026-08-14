import { loc } from '../loc'
import styles from './RulesArticle.module.css'

export default function RulesArticle({ doc, lang }) {
  return (
    <div className={styles.article}>
      {doc.sections.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <h2 className={styles.heading}>{loc(lang, section.title)}</h2>
          {section.blocks.map((block, idx) => {
            if (block.type === 'ul') {
              return (
                <ul key={idx} className={styles.list}>
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{loc(lang, item)}</li>
                  ))}
                </ul>
              )
            }
            if (block.type === 'note') {
              return (
                <p key={idx} className={styles.note}>{loc(lang, block.text)}</p>
              )
            }
            return (
              <p key={idx} className={styles.paragraph}>{loc(lang, block.text)}</p>
            )
          })}
        </section>
      ))}
    </div>
  )
}
