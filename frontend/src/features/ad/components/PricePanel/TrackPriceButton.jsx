import styles from './TrackPriceButton.module.css'

export default function TrackPriceButton({ watching, onClick, label, stopLabel }) {
  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      {watching ? stopLabel : label}
      <i className={`bi ${watching ? 'bi-check2' : 'bi-chevron-right'}`} aria-hidden />
    </button>
  )
}
