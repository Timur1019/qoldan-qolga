export const JOB_ROOT = 'Ish'
export const JOB_SEEK = 'Ish_qidirish'
export const JOB_HIRE = 'Ishchi_qidirish'

export function isJobTree(categoryCode, breadcrumb = []) {
  if (!categoryCode) return false
  if (categoryCode === JOB_ROOT || categoryCode === JOB_SEEK || categoryCode === JOB_HIRE) return true
  if (String(categoryCode).startsWith('JobSeek_') || String(categoryCode).startsWith('Hire_')) return true
  return Array.isArray(breadcrumb) && breadcrumb.some(
    (c) => c.code === JOB_ROOT || c.code === JOB_SEEK || c.code === JOB_HIRE
  )
}

export function isJobSeekTree(categoryCode, breadcrumb = []) {
  if (!categoryCode) return false
  if (categoryCode === JOB_SEEK || String(categoryCode).startsWith('JobSeek_')) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => c.code === JOB_SEEK)
}

export function isJobHireTree(categoryCode, breadcrumb = []) {
  if (!categoryCode) return false
  if (categoryCode === JOB_HIRE || String(categoryCode).startsWith('Hire_')) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => c.code === JOB_HIRE)
}

export function jobFieldFlags(categoryCode, breadcrumb = []) {
  const jobs = isJobTree(categoryCode, breadcrumb)
  const seek = isJobSeekTree(categoryCode, breadcrumb)
  const hire = isJobHireTree(categoryCode, breadcrumb)
  return {
    jobs,
    seek,
    hire,
    profession: jobs,
    industry: jobs,
    priority: seek || (!seek && !hire && jobs),
    employment: jobs,
    schedule: jobs,
    workFormat: jobs,
    salary: jobs,
    payFrequency: jobs,
    experience: jobs,
    companyFlags: seek || (!seek && !hire && jobs),
    benefits: seek || (!seek && !hire && jobs),
    candidates: jobs,
    citizenship: hire,
    age: hire,
    descriptionWords: jobs,
  }
}

export const EMPTY_JOB_FIELDS = {
  jobProfession: '',
  jobIndustry: '',
  jobPriority: 'ANY',
  jobEmployment: [],
  jobSchedule: [],
  jobWorkFormat: 'ANY',
  jobSalaryPeriod: 'ANY',
  jobPayFrequency: [],
  jobExperience: '',
  jobCitizenship: '',
  jobAgeFrom: '',
  jobAgeTo: '',
  jobCompanyVerified: false,
  jobLargeCompany: false,
  jobBenefits: [],
  jobForCandidates: [],
}

export const JOB_CATEGORY_ICONS = {
  [JOB_SEEK]: 'person-workspace',
  [JOB_HIRE]: 'person-plus',
}

export const JOB_CATEGORY_PARENTS = {
  [JOB_SEEK]: JOB_ROOT,
  [JOB_HIRE]: JOB_ROOT,
  JobSeek_architecture: JOB_SEEK,
  JobSeek_banking: JOB_SEEK,
  JobSeek_personal_services: JOB_SEEK,
  JobSeek_gov: JOB_SEEK,
  JobSeek_hotel_tourism: JOB_SEEK,
  JobSeek_mining: JOB_SEEK,
  JobSeek_oil_gas: JOB_SEEK,
  JobSeek_logistics: JOB_SEEK,
  JobSeek_utilities: JOB_SEEK,
  JobSeek_gambling: JOB_SEEK,
  JobSeek_it: JOB_SEEK,
  JobSeek_arts: JOB_SEEK,
  JobSeek_cleaning: JOB_SEEK,
  JobSeek_consulting: JOB_SEEK,
  JobSeek_forestry: JOB_SEEK,
  JobSeek_marketing: JOB_SEEK,
  JobSeek_medicine: JOB_SEEK,
  JobSeek_metallurgy: JOB_SEEK,
  JobSeek_nko: JOB_SEEK,
  JobSeek_defense: JOB_SEEK,
  JobSeek_education: JOB_SEEK,
  JobSeek_catering: JOB_SEEK,
  JobSeek_events: JOB_SEEK,
  JobSeek_security: JOB_SEEK,
  JobSeek_waste: JOB_SEEK,
  JobSeek_food_industry: JOB_SEEK,
  JobSeek_auto_sales: JOB_SEEK,
  JobSeek_realestate: JOB_SEEK,
  JobSeek_consumer_goods: JOB_SEEK,
  JobSeek_machinery: JOB_SEEK,
  JobSeek_textiles: JOB_SEEK,
  JobSeek_electro_opt: JOB_SEEK,
  JobSeek_electronics: JOB_SEEK,
  JobSeek_aerospace: JOB_SEEK,
  JobSeek_renovation: JOB_SEEK,
  JobSeek_funeral: JOB_SEEK,
  JobSeek_trade: JOB_SEEK,
  JobSeek_agriculture: JOB_SEEK,
  JobSeek_warehouses: JOB_SEEK,
  JobSeek_media: JOB_SEEK,
  JobSeek_insurance: JOB_SEEK,
  JobSeek_build_civil: JOB_SEEK,
  JobSeek_build_infra: JOB_SEEK,
  JobSeek_taxi: JOB_SEEK,
  JobSeek_telecom: JOB_SEEK,
  JobSeek_tech_repair: JOB_SEEK,
  JobSeek_transport_eng: JOB_SEEK,
  JobSeek_heavy_eng: JOB_SEEK,
  JobSeek_hr: JOB_SEEK,
  JobSeek_transport_infra: JOB_SEEK,
  JobSeek_fitness: JOB_SEEK,
  JobSeek_chemical: JOB_SEEK,
  JobSeek_energy: JOB_SEEK,
  JobSeek_legal: JOB_SEEK,
  Hire_it: JOB_HIRE,
  Hire_auto: JOB_HIRE,
  Hire_admin: JOB_HIRE,
  Hire_banks: JOB_HIRE,
  Hire_no_experience: JOB_HIRE,
  Hire_accounting: JOB_HIRE,
  Hire_top_mgmt: JOB_HIRE,
  Hire_gov_nko: JOB_HIRE,
  Hire_household: JOB_HIRE,
  Hire_utilities: JOB_HIRE,
  Hire_arts: JOB_HIRE,
  Hire_consulting: JOB_HIRE,
  Hire_courier: JOB_HIRE,
  Hire_marketing: JOB_HIRE,
  Hire_medicine: JOB_HIRE,
  Hire_education: JOB_HIRE,
  Hire_security: JOB_HIRE,
  Hire_sales: JOB_HIRE,
  Hire_production: JOB_HIRE,
  Hire_insurance: JOB_HIRE,
  Hire_construction: JOB_HIRE,
  Hire_taxi: JOB_HIRE,
  Hire_logistics: JOB_HIRE,
  Hire_tourism: JOB_HIRE,
  Hire_hr: JOB_HIRE,
  Hire_fitness: JOB_HIRE,
  Hire_legal: JOB_HIRE,
}
