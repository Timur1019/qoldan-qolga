import { TextInput } from 'react-native';

import { FilterChips } from '@/components/FilterChips/FilterChips';
import { jobFieldFlags } from '@/constants/jobCategories';
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
} from '@/constants/jobFilterOptions';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import type { CategoryFiltersState } from '@/utils/categoryFiltersState';

import { styles } from './CategoryFiltersSheet.styles';
import { FieldLabel, RangeInputs, SectionTitle, ToggleRow } from './FilterFieldRows';

type Labeled = { value: string; ru: string; uz: string };

function chips(options: Labeled[]) {
  return options.filter((o) => o.value).map((o) => ({ value: o.value, label: o.ru }));
}

interface Props {
  categoryCode?: string;
  breadcrumb?: CategoryDto[];
  draft: CategoryFiltersState;
  patch: (partial: Partial<CategoryFiltersState>) => void;
}

export function JobFiltersSection({ categoryCode, breadcrumb = [], draft, patch }: Props) {
  const flags = jobFieldFlags(categoryCode, breadcrumb);
  if (!flags.jobs) return null;
  const industry = flags.hire && !flags.seek ? JOB_INDUSTRY_HIRE : JOB_INDUSTRY_SEEK;

  return (
    <>
      <SectionTitle>Ish</SectionTitle>
      <FieldLabel>Kasb</FieldLabel>
      <FilterChips
        options={chips(JOB_PROFESSIONS)}
        value={draft.jobProfession}
        onChange={(jobProfession) => patch({ jobProfession })}
      />
      <FieldLabel>Soha</FieldLabel>
      <FilterChips
        options={chips(industry)}
        value={draft.jobIndustry}
        onChange={(jobIndustry) => patch({ jobIndustry })}
      />
      {flags.priority ? (
        <>
          <FieldLabel>Ustuvorlik</FieldLabel>
          <FilterChips
            single
            options={chips(JOB_PRIORITY_OPTIONS)}
            value={draft.jobPriority ? [draft.jobPriority] : []}
            onChange={(arr) => patch({ jobPriority: arr[0] || 'ANY' })}
          />
        </>
      ) : null}
      <FieldLabel>Bandlik</FieldLabel>
      <FilterChips
        options={chips(JOB_EMPLOYMENT_OPTIONS)}
        value={draft.jobEmployment}
        onChange={(jobEmployment) => patch({ jobEmployment })}
      />
      <FieldLabel>Jadval</FieldLabel>
      <FilterChips
        options={chips(JOB_SCHEDULE_OPTIONS)}
        value={draft.jobSchedule}
        onChange={(jobSchedule) => patch({ jobSchedule })}
      />
      <FieldLabel>Format</FieldLabel>
      <FilterChips
        single
        options={chips(JOB_FORMAT_OPTIONS)}
        value={draft.jobWorkFormat ? [draft.jobWorkFormat] : []}
        onChange={(arr) => patch({ jobWorkFormat: arr[0] || 'ANY' })}
      />
      <FieldLabel>Maosh</FieldLabel>
      <RangeInputs
        from={draft.priceFrom}
        to={draft.priceTo}
        fromPh="dan"
        toPh="gacha"
        onFrom={(priceFrom) => patch({ priceFrom })}
        onTo={(priceTo) => patch({ priceTo })}
      />
      <FilterChips
        single
        options={chips(JOB_SALARY_PERIOD_OPTIONS)}
        value={draft.jobSalaryPeriod ? [draft.jobSalaryPeriod] : []}
        onChange={(arr) => patch({ jobSalaryPeriod: arr[0] || 'ANY' })}
      />
      <FieldLabel>To'lov chastotasi</FieldLabel>
      <FilterChips
        options={chips(JOB_PAY_FREQUENCY_OPTIONS)}
        value={draft.jobPayFrequency}
        onChange={(jobPayFrequency) => patch({ jobPayFrequency })}
      />
      <FieldLabel>Tajriba</FieldLabel>
      <FilterChips
        single
        options={chips(JOB_EXPERIENCE_OPTIONS)}
        value={draft.jobExperience ? [draft.jobExperience] : []}
        onChange={(arr) => patch({ jobExperience: arr[0] || '' })}
      />
      {flags.companyFlags ? (
        <>
          <ToggleRow
            label="Kompaniya tekshirilgan"
            value={draft.jobCompanyVerified}
            onChange={(jobCompanyVerified) => patch({ jobCompanyVerified })}
          />
          <ToggleRow
            label="Yirik kompaniyalar"
            value={draft.jobLargeCompany}
            onChange={(jobLargeCompany) => patch({ jobLargeCompany })}
          />
        </>
      ) : null}
      {flags.benefits ? (
        <>
          <FieldLabel>Taqdim etadi</FieldLabel>
          <FilterChips
            options={chips(JOB_BENEFIT_OPTIONS)}
            value={draft.jobBenefits}
            onChange={(jobBenefits) => patch({ jobBenefits })}
          />
        </>
      ) : null}
      {flags.candidates ? (
        <>
          <FieldLabel>Nomzodlar</FieldLabel>
          <FilterChips
            options={chips(JOB_CANDIDATE_OPTIONS)}
            value={draft.jobForCandidates}
            onChange={(jobForCandidates) => patch({ jobForCandidates })}
          />
        </>
      ) : null}
      {flags.citizenship ? (
        <>
          <FieldLabel>Fuqarolik</FieldLabel>
          <FilterChips
            single
            options={chips(JOB_CITIZENSHIP_OPTIONS)}
            value={draft.jobCitizenship ? [draft.jobCitizenship] : []}
            onChange={(arr) => patch({ jobCitizenship: arr[0] || '' })}
          />
        </>
      ) : null}
      {flags.age ? (
        <>
          <FieldLabel>Yosh</FieldLabel>
          <RangeInputs
            from={draft.jobAgeFrom}
            to={draft.jobAgeTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(jobAgeFrom) => patch({ jobAgeFrom })}
            onTo={(jobAgeTo) => patch({ jobAgeTo })}
          />
        </>
      ) : null}
      {flags.descriptionWords ? (
        <>
          <FieldLabel>Tavsifdagi so'zlar</FieldLabel>
          <TextInput
            style={styles.input}
            placeholder="Siz uchun muhim narsa"
            placeholderTextColor={colors.muted}
            value={draft.query}
            onChangeText={(query) => patch({ query })}
          />
        </>
      ) : null}
    </>
  );
}
