import {
  JOB_BENEFIT_OPTIONS,
  JOB_CANDIDATE_OPTIONS,
  JOB_EMPLOYMENT_OPTIONS,
  JOB_FORMAT_OPTIONS,
  JOB_INDUSTRY_HIRE,
  JOB_INDUSTRY_SEEK,
  JOB_PAY_FREQUENCY_OPTIONS,
  JOB_PRIORITY_OPTIONS,
  JOB_PROFESSIONS,
  JOB_SALARY_PERIOD_OPTIONS,
  JOB_SCHEDULE_OPTIONS,
} from '../../../../constants/jobFilterOptions'
import sidebar from './AdsFiltersSidebar.module.css'
import styles from './JobFilters.module.css'
import { JobCheckList, JobChipRow, JobRadioList } from './JobChoiceLists'
import JobSearchChecklist from './JobSearchChecklist'

export default function JobSidebarFields({ flags, filterDraft, setFilterDraft, lang }) {
  if (!flags.jobs) return null
  const industryOptions = flags.hire && !flags.seek ? JOB_INDUSTRY_HIRE : JOB_INDUSTRY_SEEK
  const ru = lang === 'ru'

  return (
    <>
      <JobSearchChecklist
        title={ru ? 'Профессия' : 'Kasb'}
        options={JOB_PROFESSIONS}
        selected={filterDraft.jobProfession}
        fieldKey="jobProfession"
        setFilterDraft={setFilterDraft}
        lang={lang}
        popularTitle={ru ? 'Популярные' : 'Mashhur'}
        allTitle={ru ? 'Все' : 'Barchasi'}
        searchPlaceholder={ru ? 'Поиск' : 'Qidirish'}
        moreLabel={ru ? 'Показать ещё' : "Ko'proq"}
        lessLabel={ru ? 'Свернуть' : 'Yig‘ish'}
      />

      <JobCheckList
        title={ru ? 'Сфера деятельности компании' : 'Kompaniya sohasi'}
        options={industryOptions}
        selected={filterDraft.jobIndustry}
        fieldKey="jobIndustry"
        setFilterDraft={setFilterDraft}
        lang={lang}
        collapsedCount={5}
      />

      {flags.priority && (
        <JobRadioList
          title={ru ? 'Поиск по приоритетам' : 'Ustuvorlik'}
          options={JOB_PRIORITY_OPTIONS}
          value={filterDraft.jobPriority || 'ANY'}
          fieldKey="jobPriority"
          setFilterDraft={setFilterDraft}
          lang={lang}
        />
      )}

      <JobCheckList
        title={ru ? 'Занятость' : 'Bandlik'}
        options={JOB_EMPLOYMENT_OPTIONS}
        selected={filterDraft.jobEmployment}
        fieldKey="jobEmployment"
        setFilterDraft={setFilterDraft}
        lang={lang}
        collapsedCount={4}
      />

      <JobCheckList
        title={ru ? 'График' : 'Jadval'}
        options={JOB_SCHEDULE_OPTIONS}
        selected={filterDraft.jobSchedule}
        fieldKey="jobSchedule"
        setFilterDraft={setFilterDraft}
        lang={lang}
        collapsedCount={4}
      />

      <JobRadioList
        title={ru ? 'Формат работы' : 'Ish formati'}
        options={JOB_FORMAT_OPTIONS}
        value={filterDraft.jobWorkFormat || 'ANY'}
        fieldKey="jobWorkFormat"
        setFilterDraft={setFilterDraft}
        lang={lang}
      />

      <div className={sidebar.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{ru ? 'Зарплата' : 'Maosh'}</p>
        <div className={styles.salaryRow}>
          <input
            className="form-control form-control-sm"
            type="number"
            placeholder={ru ? 'От' : 'Dan'}
            value={filterDraft.priceFrom || ''}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceFrom: e.target.value }))}
          />
          <input
            className="form-control form-control-sm"
            type="number"
            placeholder={ru ? 'до' : 'gacha'}
            value={filterDraft.priceTo || ''}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceTo: e.target.value }))}
          />
        </div>
        <JobChipRow
          options={JOB_SALARY_PERIOD_OPTIONS}
          value={filterDraft.jobSalaryPeriod || 'ANY'}
          fieldKey="jobSalaryPeriod"
          setFilterDraft={setFilterDraft}
          lang={lang}
        />
      </div>

      <JobCheckList
        title={ru ? 'Частота выплат' : "To'lov chastotasi"}
        options={JOB_PAY_FREQUENCY_OPTIONS}
        selected={filterDraft.jobPayFrequency}
        fieldKey="jobPayFrequency"
        setFilterDraft={setFilterDraft}
        lang={lang}
        collapsedCount={5}
      />

      <div className={sidebar.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{ru ? 'Опыт работы' : 'Ish tajribasi'}</p>
        <select
          className="form-select form-select-sm"
          value={filterDraft.jobExperience || ''}
          onChange={(e) => setFilterDraft((d) => ({ ...d, jobExperience: e.target.value }))}
        >
          {JOB_EXPERIENCE_OPTIONS_LOCAL.map((o) => (
            <option key={o.value || 'any'} value={o.value}>
              {lang === 'ru' ? o.ru : o.uz}
            </option>
          ))}
        </select>
      </div>

      {flags.companyFlags && (
        <div className={sidebar.sidebarBlock}>
          <div className={sidebar.checkList}>
            <label className={sidebar.checkRow} htmlFor="job-verified">
              <input
                id="job-verified"
                type="checkbox"
                className={sidebar.checkInput}
                checked={!!filterDraft.jobCompanyVerified}
                onChange={() => setFilterDraft((d) => ({ ...d, jobCompanyVerified: !d.jobCompanyVerified }))}
              />
              <span className={sidebar.checkLabel}>{ru ? 'Компания проверена' : 'Kompaniya tekshirilgan'}</span>
            </label>
            <label className={sidebar.checkRow} htmlFor="job-large">
              <input
                id="job-large"
                type="checkbox"
                className={sidebar.checkInput}
                checked={!!filterDraft.jobLargeCompany}
                onChange={() => setFilterDraft((d) => ({ ...d, jobLargeCompany: !d.jobLargeCompany }))}
              />
              <span className={sidebar.checkLabel}>{ru ? 'Крупные компании' : 'Yirik kompaniyalar'}</span>
            </label>
          </div>
        </div>
      )}

      {flags.benefits && (
        <JobCheckList
          title={ru ? 'Компания предоставляет' : 'Kompaniya taqdim etadi'}
          options={JOB_BENEFIT_OPTIONS}
          selected={filterDraft.jobBenefits}
          fieldKey="jobBenefits"
          setFilterDraft={setFilterDraft}
          lang={lang}
          collapsedCount={4}
        />
      )}

      {flags.candidates && (
        <JobCheckList
          title={ru ? 'В том числе для кандидатов' : 'Nomzodlar uchun'}
          options={JOB_CANDIDATE_OPTIONS}
          selected={filterDraft.jobForCandidates}
          fieldKey="jobForCandidates"
          setFilterDraft={setFilterDraft}
          lang={lang}
          collapsedCount={3}
        />
      )}

      {flags.citizenship && (
        <div className={sidebar.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{ru ? 'Гражданство' : 'Fuqarolik'}</p>
          <select
            className="form-select form-select-sm"
            value={filterDraft.jobCitizenship || ''}
            onChange={(e) => setFilterDraft((d) => ({ ...d, jobCitizenship: e.target.value }))}
          >
            <option value="">{ru ? 'Неважно' : "Farqi yo'q"}</option>
            <option value="UZ">{ru ? 'Узбекистан' : "O'zbekiston"}</option>
            <option value="ANY">{ru ? 'Любое' : 'Istalgan'}</option>
          </select>
        </div>
      )}

      {flags.age && (
        <div className={sidebar.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{ru ? 'Возраст' : 'Yosh'}</p>
          <div className={styles.salaryRow}>
            <input
              className="form-control form-control-sm"
              type="number"
              placeholder={ru ? 'От' : 'Dan'}
              value={filterDraft.jobAgeFrom || ''}
              onChange={(e) => setFilterDraft((d) => ({ ...d, jobAgeFrom: e.target.value }))}
            />
            <input
              className="form-control form-control-sm"
              type="number"
              placeholder={ru ? 'до' : 'gacha'}
              value={filterDraft.jobAgeTo || ''}
              onChange={(e) => setFilterDraft((d) => ({ ...d, jobAgeTo: e.target.value }))}
            />
          </div>
        </div>
      )}

      {flags.descriptionWords && (
        <div className={sidebar.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{ru ? 'Слова в описании' : 'Tavsifdagi so‘zlar'}</p>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={ru ? 'Что-то важное для вас' : 'Siz uchun muhim narsa'}
            value={filterDraft.query || ''}
            onChange={(e) => setFilterDraft((d) => ({ ...d, query: e.target.value }))}
          />
        </div>
      )}
    </>
  )
}

const JOB_EXPERIENCE_OPTIONS_LOCAL = [
  { value: '', ru: 'Неважно', uz: "Farqi yo'q" },
  { value: 'NONE', ru: 'Без опыта', uz: 'Tajribasiz' },
  { value: 'Y1', ru: 'От 1 года', uz: '1 yildan' },
  { value: 'Y3', ru: 'От 3 лет', uz: '3 yildan' },
  { value: 'Y5', ru: 'От 5 лет', uz: '5 yildan' },
]
