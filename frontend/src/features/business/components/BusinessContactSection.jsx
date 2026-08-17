import { Link } from 'react-router-dom'
import BusinessSectionCard from './BusinessSectionCard'
import { rulesDocPath } from '../../../constants/routes'
import styles from './BusinessContactSection.module.css'

export default function BusinessContactSection() {
  return (
    <BusinessSectionCard
      title="Контакты и завершение"
      iconTone="amber"
      icon={<i className="bi bi-person-badge" />}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="bs-phone">
          Номер телефона <span className={styles.req}>*</span>
        </label>
        <div className={styles.phoneWrap}>
          <span className={styles.prefix} aria-hidden>
            +998
          </span>
          <input
            id="bs-phone"
            name="phone"
            type="tel"
            className={styles.phoneInput}
            placeholder="(__) ___-____"
            inputMode="numeric"
            autoComplete="tel-national"
            required
          />
        </div>
      </div>

      <label className={styles.agree}>
        <input type="checkbox" name="agreement" value="true" required className={styles.agreeInput} />
        <span className={styles.agreeText}>
          Я соглашаюсь с{' '}
          <Link to={rulesDocPath('terms')} className={styles.link} target="_blank" rel="noreferrer">
            пользовательским соглашением
          </Link>{' '}
          и даю согласие на обработку персональных и бизнес-данных согласно{' '}
          <Link to={rulesDocPath('privacy')} className={styles.link} target="_blank" rel="noreferrer">
            политике конфиденциальности
          </Link>
          . <span className={styles.req}>*</span>
        </span>
      </label>
    </BusinessSectionCard>
  )
}
