import { useEffect } from 'react'
import { useLang } from '@/context/LangContext'
import { useAuthModal } from '@/hooks'
import { PARAMS } from '@/constants/routes'
import AboutHero from './components/AboutHero'
import AboutIntroCards from './components/AboutIntroCards'
import AboutGoal from './components/AboutGoal'
import AboutWhy from './components/AboutWhy'
import AboutMission from './components/AboutMission'
import AboutJoinBanner from './components/AboutJoinBanner'
import ScrollTop from '@/components/ui/ScrollTop'
import styles from './About.module.css'

export default function About() {
  const { t, lang } = useLang()
  const openAuthModal = useAuthModal()

  useEffect(() => {
    document.title = t('about.pageTitle')
    return () => {
      document.title = 'Qoldan Qolga'
    }
  }, [t])

  const onJoin = () => openAuthModal(PARAMS.AUTH_LOGIN)

  return (
    <div className={styles.page}>
      <AboutHero t={t} onJoin={onJoin} />
      <AboutIntroCards t={t} lang={lang} />
      <AboutGoal t={t} />
      <AboutWhy t={t} />
      <AboutMission t={t} />
      <AboutJoinBanner t={t} onJoin={onJoin} />
      <ScrollTop />
    </div>
  )
}
