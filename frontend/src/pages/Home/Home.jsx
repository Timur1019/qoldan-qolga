import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Главная</h1>
      <p className={styles.lead}>
        Добро пожаловать в Qoldan Qolga.
      </p>
    </div>
  )
}
