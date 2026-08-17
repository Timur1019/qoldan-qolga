import BusinessSectionCard from './BusinessSectionCard'
import { BUSINESS_TYPES, PRODUCT_CATEGORIES } from '../businessFormOptions'
import styles from './BusinessGeneralSection.module.css'

export default function BusinessGeneralSection() {
  return (
    <BusinessSectionCard
      title="Основная информация"
      icon={<i className="bi bi-shop" />}
    >
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bs-fullName">
            Как вас зовут <span className={styles.req}>*</span>
          </label>
          <input
            id="bs-fullName"
            name="fullName"
            type="text"
            className={styles.input}
            placeholder="Имя и фамилия"
            required
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bs-shopName">
            Название магазина <span className={styles.req}>*</span>
          </label>
          <input
            id="bs-shopName"
            name="shopName"
            type="text"
            className={styles.input}
            placeholder="Например, Qoldan Store"
            required
          />
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>
          Форма бизнеса <span className={styles.req}>*</span>
        </legend>
        <div className={styles.typeGrid}>
          {BUSINESS_TYPES.map((item) => (
            <label key={item.value} className={styles.typeCard}>
              <input
                type="radio"
                name="businessType"
                value={item.value}
                required
                className={styles.typeInput}
              />
              <span className={styles.typeBody}>
                <span className={styles.typeLabel}>{item.label}</span>
                <span className={styles.typeHint}>{item.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bs-city">
            Город <span className={styles.req}>*</span>
          </label>
          <input
            id="bs-city"
            name="city"
            type="text"
            className={styles.input}
            placeholder="Например, Ташкент"
            required
            autoComplete="address-level2"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bs-shopUrl">
            Ник в соцсетях / Telegram
          </label>
          <input
            id="bs-shopUrl"
            name="shopUrl"
            type="text"
            className={styles.input}
            placeholder="@nickname или имя аккаунта"
            autoComplete="username"
          />
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>
          Категория товаров <span className={styles.req}>*</span>
        </legend>
        <div className={styles.catGrid}>
          {PRODUCT_CATEGORIES.map((item) => (
            <label key={item.value} className={styles.catChip}>
              <input
                type="radio"
                name="productCategory"
                value={item.value}
                required
                className={styles.catInput}
              />
              <span className={styles.catText}>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </BusinessSectionCard>
  )
}
