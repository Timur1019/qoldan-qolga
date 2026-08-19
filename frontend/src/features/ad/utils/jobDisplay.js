import { JOB_PROFESSIONS, jobOptionLabel } from '../../constants/jobFilterOptions'
import {
  JOB_BENEFIT_OPTIONS,
  JOB_CANDIDATE_OPTIONS,
  JOB_EMPLOYMENT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_FORMAT_OPTIONS,
  JOB_INDUSTRY_HIRE,
  JOB_INDUSTRY_SEEK,
  JOB_PAY_FREQUENCY_OPTIONS,
  JOB_PRIORITY_OPTIONS,
  JOB_SALARY_PERIOD_OPTIONS,
  JOB_SCHEDULE_OPTIONS,
} from '../../constants/jobFilterOptions'

function findLabel(options, value, lang) {
  const opt = options.find((o) => o.value === value)
  return opt ? jobOptionLabel(opt, lang) : value
}

function csvLabels(csv, options, lang) {
  if (!csv) return ''
  return String(csv)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((v) => findLabel(options, v, lang))
    .join(', ')
}

export function jobCharacteristicRows(ad, lang) {
  if (!ad?.jobProfession && !ad?.jobIndustry && !ad?.jobEmployment) return []
  const rows = []
  if (ad.jobProfession) {
    rows.push({ label: lang === 'ru' ? 'Профессия' : 'Kasb', value: findLabel(JOB_PROFESSIONS, ad.jobProfession, lang) })
  }
  if (ad.jobIndustry) {
    const ind = [...JOB_INDUSTRY_SEEK, ...JOB_INDUSTRY_HIRE]
    rows.push({ label: lang === 'ru' ? 'Сфера' : 'Soha', value: findLabel(ind, ad.jobIndustry, lang) })
  }
  if (ad.jobPriority && ad.jobPriority !== 'ANY') {
    rows.push({ label: lang === 'ru' ? 'Приоритет' : 'Ustuvorlik', value: findLabel(JOB_PRIORITY_OPTIONS, ad.jobPriority, lang) })
  }
  const emp = csvLabels(ad.jobEmployment, JOB_EMPLOYMENT_OPTIONS, lang)
  if (emp) rows.push({ label: lang === 'ru' ? 'Занятость' : 'Bandlik', value: emp })
  const sch = csvLabels(ad.jobSchedule, JOB_SCHEDULE_OPTIONS, lang)
  if (sch) rows.push({ label: lang === 'ru' ? 'График' : 'Jadval', value: sch })
  if (ad.jobWorkFormat && ad.jobWorkFormat !== 'ANY') {
    rows.push({ label: lang === 'ru' ? 'Формат' : 'Format', value: findLabel(JOB_FORMAT_OPTIONS, ad.jobWorkFormat, lang) })
  }
  if (ad.jobSalaryPeriod && ad.jobSalaryPeriod !== 'ANY') {
    rows.push({ label: lang === 'ru' ? 'Зарплата' : 'Maosh', value: findLabel(JOB_SALARY_PERIOD_OPTIONS, ad.jobSalaryPeriod, lang) })
  }
  const freq = csvLabels(ad.jobPayFrequency, JOB_PAY_FREQUENCY_OPTIONS, lang)
  if (freq) rows.push({ label: lang === 'ru' ? 'Выплаты' : "To'lov", value: freq })
  if (ad.jobExperience) {
    rows.push({ label: lang === 'ru' ? 'Опыт' : 'Tajriba', value: findLabel(JOB_EXPERIENCE_OPTIONS, ad.jobExperience, lang) })
  }
  const ben = csvLabels(ad.jobBenefits, JOB_BENEFIT_OPTIONS, lang)
  if (ben) rows.push({ label: lang === 'ru' ? 'Предоставляет' : 'Taqdim etadi', value: ben })
  const cand = csvLabels(ad.jobForCandidates, JOB_CANDIDATE_OPTIONS, lang)
  if (cand) rows.push({ label: lang === 'ru' ? 'Для кандидатов' : 'Nomzodlar', value: cand })
  return rows
}
