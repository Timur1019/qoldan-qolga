import type { CategoryDto } from '@/types/api';

export const JOB_ROOT = 'Ish';
export const JOB_SEEK = 'Ish_qidirish';
export const JOB_HIRE = 'Ishchi_qidirish';

export function isJobTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  if (!categoryCode) return false;
  if (categoryCode === JOB_ROOT || categoryCode === JOB_SEEK || categoryCode === JOB_HIRE) return true;
  if (categoryCode.startsWith('JobSeek_') || categoryCode.startsWith('Hire_')) return true;
  return breadcrumb.some((c) => c.code === JOB_ROOT || c.code === JOB_SEEK || c.code === JOB_HIRE);
}

export function isJobSeekTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  if (!categoryCode) return false;
  if (categoryCode === JOB_SEEK || categoryCode.startsWith('JobSeek_')) return true;
  return breadcrumb.some((c) => c.code === JOB_SEEK);
}

export function isJobHireTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  if (!categoryCode) return false;
  if (categoryCode === JOB_HIRE || categoryCode.startsWith('Hire_')) return true;
  return breadcrumb.some((c) => c.code === JOB_HIRE);
}

export function jobFieldFlags(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  const jobs = isJobTree(categoryCode, breadcrumb);
  const seek = isJobSeekTree(categoryCode, breadcrumb);
  const hire = isJobHireTree(categoryCode, breadcrumb);
  return {
    jobs,
    seek,
    hire,
    priority: seek || (!seek && !hire && jobs),
    companyFlags: seek || (!seek && !hire && jobs),
    benefits: seek || (!seek && !hire && jobs),
    candidates: jobs,
    citizenship: hire,
    age: hire,
    descriptionWords: jobs,
  };
}
