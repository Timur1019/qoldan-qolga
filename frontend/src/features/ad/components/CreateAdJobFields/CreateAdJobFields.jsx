import { jobFieldFlags } from '../../../../constants/jobCategories'
import {
  JOB_BENEFIT_OPTIONS,
  JOB_CANDIDATE_OPTIONS,
  JOB_CITIZENSHIP_OPTIONS,
  JOB_EMPLOYMENT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_FORMAT_OPTIONS,
  JOB_INDUSTRY_HIRE,
  JOB_INDUSTRY_SEEK,
  JOB_PAY_FREQUENCY_OPTIONS,
  JOB_PRIORITY_OPTIONS,
  JOB_PROFESSIONS,
  JOB_SALARY_PERIOD_OPTIONS,
  JOB_SCHEDULE_OPTIONS,
  jobOptionLabel,
} from '../../../../constants/jobFilterOptions'
import { UiField } from '@/shared/ui'
import styles from './CreateAdJobFields.module.css'

export default function CreateAdJobFields({ categoryCode, categoryBreadcrumb, form, onChange, lang }) {
  const flags = jobFieldFlags(categoryCode, categoryBreadcrumb)
  if (!flags.jobs) return null
  const ru = lang === 'ru'
  const industries = flags.hire && !flags.seek ? JOB_INDUSTRY_HIRE : JOB_INDUSTRY_SEEK

  const toggleArr = (key, value) => {
    const arr = Array.isArray(form[key]) ? [...form[key]] : []
    const idx = arr.indexOf(value)
    if (idx >= 0) arr.splice(idx, 1)
    else arr.push(value)
    onChange({ [key]: arr })
  }

  return (
    <section className={`app-card ${styles.card}`}>
      <h2 className="h6 mb-3">{ru ? 'Параметры работы' : 'Ish parametrlari'}</h2>

      <UiField label={`${ru ? 'Профессия' : 'Kasb'} *`}>
        <select
          className="form-select"
          value={form.jobProfession || ''}
          onChange={(e) => onChange({ jobProfession: e.target.value })}
        >
          <option value="">{ru ? 'Выберите' : 'Tanlang'}</option>
          {JOB_PROFESSIONS.map((o) => (
            <option key={o.value} value={o.value}>{jobOptionLabel(o, lang)}</option>
          ))}
        </select>
      </UiField>

      <UiField label={ru ? 'Сфера деятельности' : 'Soha'}>
        <select
          className="form-select"
          value={form.jobIndustry || ''}
          onChange={(e) => onChange({ jobIndustry: e.target.value })}
        >
          <option value="">{ru ? 'Не указано' : "Ko'rsatilmagan"}</option>
          {industries.map((o) => (
            <option key={o.value} value={o.value}>{jobOptionLabel(o, lang)}</option>
          ))}
        </select>
      </UiField>

      {flags.priority && (
        <UiField label={ru ? 'Приоритет' : 'Ustuvorlik'}>
          <select
            className="form-select"
            value={form.jobPriority || 'ANY'}
            onChange={(e) => onChange({ jobPriority: e.target.value })}
          >
            {JOB_PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{jobOptionLabel(o, lang)}</option>
            ))}
          </select>
        </UiField>
      )}

      <fieldset className={styles.fieldset}>
        <legend>{ru ? 'Занятость' : 'Bandlik'}</legend>
        {JOB_EMPLOYMENT_OPTIONS.map((o) => (
          <label key={o.value} className={styles.check}>
            <input
              type="checkbox"
              checked={(form.jobEmployment || []).includes(o.value)}
              onChange={() => toggleArr('jobEmployment', o.value)}
            />
            {jobOptionLabel(o, lang)}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>{ru ? 'График' : 'Jadval'}</legend>
        {JOB_SCHEDULE_OPTIONS.map((o) => (
          <label key={o.value} className={styles.check}>
            <input
              type="checkbox"
              checked={(form.jobSchedule || []).includes(o.value)}
              onChange={() => toggleArr('jobSchedule', o.value)}
            />
            {jobOptionLabel(o, lang)}
          </label>
        ))}
      </fieldset>

      <UiField label={ru ? 'Формат работы' : 'Ish formati'}>
        <select
          className="form-select"
          value={form.jobWorkFormat || 'ANY'}
          onChange={(e) => onChange({ jobWorkFormat: e.target.value })}
        >
          {JOB_FORMAT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{jobOptionLabel(o, lang)}</option>
          ))}
        </select>
      </UiField>

      <UiField label={ru ? 'Период зарплаты' : 'Maosh davri'}>
        <select
          className="form-select"
          value={form.jobSalaryPeriod || 'ANY'}
          onChange={(e) => onChange({ jobSalaryPeriod: e.target.value })}
        >
          {JOB_SALARY_PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{jobOptionLabel(o, lang)}</option>
          ))}
        </select>
      </UiField>

      <fieldset className={styles.fieldset}>
        <legend>{ru ? 'Частота выплат' : "To'lov chastotasi"}</legend>
        {JOB_PAY_FREQUENCY_OPTIONS.map((o) => (
          <label key={o.value} className={styles.check}>
            <input
              type="checkbox"
              checked={(form.jobPayFrequency || []).includes(o.value)}
              onChange={() => toggleArr('jobPayFrequency', o.value)}
            />
            {jobOptionLabel(o, lang)}
          </label>
        ))}
      </fieldset>

      <UiField label={ru ? 'Опыт работы' : 'Ish tajribasi'}>
        <select
          className="form-select"
          value={form.jobExperience || ''}
          onChange={(e) => onChange({ jobExperience: e.target.value })}
        >
          {JOB_EXPERIENCE_OPTIONS.map((o) => (
            <option key={o.value || 'any'} value={o.value}>{jobOptionLabel(o, lang)}</option>
          ))}
        </select>
      </UiField>

      {flags.citizenship && (
        <UiField label={ru ? 'Гражданство' : 'Fuqarolik'}>
          <select
            className="form-select"
            value={form.jobCitizenship || ''}
            onChange={(e) => onChange({ jobCitizenship: e.target.value })}
          >
            {JOB_CITIZENSHIP_OPTIONS.map((o) => (
              <option key={o.value || 'any'} value={o.value}>{jobOptionLabel(o, lang)}</option>
            ))}
          </select>
        </UiField>
      )}

      {flags.age && (
        <div className={styles.ageRow}>
          <UiField label={ru ? 'Возраст от' : 'Yosh dan'}>
            <input
              className="form-control"
              type="number"
              value={form.jobAgeFrom || ''}
              onChange={(e) => onChange({ jobAgeFrom: e.target.value })}
            />
          </UiField>
          <UiField label={ru ? 'до' : 'gacha'}>
            <input
              className="form-control"
              type="number"
              value={form.jobAgeTo || ''}
              onChange={(e) => onChange({ jobAgeTo: e.target.value })}
            />
          </UiField>
        </div>
      )}

      {flags.companyFlags && (
        <fieldset className={styles.fieldset}>
          <legend>{ru ? 'О компании' : 'Kompaniya'}</legend>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={!!form.jobCompanyVerified}
              onChange={() => onChange({ jobCompanyVerified: !form.jobCompanyVerified })}
            />
            {ru ? 'Компания проверена' : 'Kompaniya tekshirilgan'}
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={!!form.jobLargeCompany}
              onChange={() => onChange({ jobLargeCompany: !form.jobLargeCompany })}
            />
            {ru ? 'Крупная компания' : 'Yirik kompaniya'}
          </label>
        </fieldset>
      )}

      {flags.benefits && (
        <fieldset className={styles.fieldset}>
          <legend>{ru ? 'Компания предоставляет' : 'Kompaniya taqdim etadi'}</legend>
          {JOB_BENEFIT_OPTIONS.map((o) => (
            <label key={o.value} className={styles.check}>
              <input
                type="checkbox"
                checked={(form.jobBenefits || []).includes(o.value)}
                onChange={() => toggleArr('jobBenefits', o.value)}
              />
              {jobOptionLabel(o, lang)}
            </label>
          ))}
        </fieldset>
      )}

      {flags.candidates && (
        <fieldset className={styles.fieldset}>
          <legend>{ru ? 'Подходит кандидатам' : 'Nomzodlar'}</legend>
          {JOB_CANDIDATE_OPTIONS.map((o) => (
            <label key={o.value} className={styles.check}>
              <input
                type="checkbox"
                checked={(form.jobForCandidates || []).includes(o.value)}
                onChange={() => toggleArr('jobForCandidates', o.value)}
              />
              {jobOptionLabel(o, lang)}
            </label>
          ))}
        </fieldset>
      )}
    </section>
  )
}
