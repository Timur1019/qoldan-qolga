import { Link } from 'react-router-dom'
import { rulesDocPath } from '../../constants/routes'
import styles from './IdVerificationConsent.module.css'

export default function IdVerificationConsent({ t }) {
  return (
    <p className={styles.text}>
      {t('profile.verificationConsentPrefix')}{' '}
      <Link to={rulesDocPath('privacy')} target="_blank" rel="noreferrer" className={styles.link}>
        {t('profile.verificationConsentPrivacy')}
      </Link>
      {' '}{t('profile.verificationConsentAnd')}{' '}
      <Link to={rulesDocPath('terms')} target="_blank" rel="noreferrer" className={styles.link}>
        {t('profile.verificationConsentTerms')}
      </Link>
    </p>
  )
}
