import { Pressable, Switch, Text, TextInput, View } from 'react-native';

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
import type { CreateAdFormState } from '@/utils/createAdForm';

import { styles } from '@/styles/screens/createAd.styles';

type Opt = { value: string; ru: string };

interface Props {
  categoryCode?: string;
  breadcrumb?: CategoryDto[];
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
}

function ChipRow({
  label,
  options,
  value,
  onChange,
  required,
}: {
  label: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <View style={styles.chipRow}>
        {options.filter((o) => o.value).map((o) => {
          const on = value === o.value;
          return (
            <Pressable key={o.value} style={[styles.chip, on && styles.chipOn]} onPress={() => onChange(o.value)}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.ru}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MultiChip({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: Opt[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <Pressable
              key={o.value}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => onChange(on ? values.filter((v) => v !== o.value) : [...values, o.value])}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.ru}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CreateAdJobSection({ categoryCode, breadcrumb = [], form, patch }: Props) {
  const flags = jobFieldFlags(categoryCode, breadcrumb);
  if (!flags.jobs) return null;
  const industries = flags.hire && !flags.seek ? JOB_INDUSTRY_HIRE : JOB_INDUSTRY_SEEK;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Ish parametrlari</Text>
      <ChipRow
        label="Kasb"
        required
        options={JOB_PROFESSIONS}
        value={form.jobProfession}
        onChange={(jobProfession) => patch({ jobProfession })}
      />
      <ChipRow
        label="Soha"
        options={industries}
        value={form.jobIndustry}
        onChange={(jobIndustry) => patch({ jobIndustry })}
      />
      {flags.priority ? (
        <ChipRow
          label="Ustuvorlik"
          options={JOB_PRIORITY_OPTIONS}
          value={form.jobPriority}
          onChange={(jobPriority) => patch({ jobPriority })}
        />
      ) : null}
      <MultiChip
        label="Bandlik"
        options={JOB_EMPLOYMENT_OPTIONS}
        values={form.jobEmployment}
        onChange={(jobEmployment) => patch({ jobEmployment })}
      />
      <MultiChip
        label="Jadval"
        options={JOB_SCHEDULE_OPTIONS}
        values={form.jobSchedule}
        onChange={(jobSchedule) => patch({ jobSchedule })}
      />
      <ChipRow
        label="Format"
        options={JOB_FORMAT_OPTIONS}
        value={form.jobWorkFormat}
        onChange={(jobWorkFormat) => patch({ jobWorkFormat })}
      />
      <ChipRow
        label="Maosh davri"
        options={JOB_SALARY_PERIOD_OPTIONS}
        value={form.jobSalaryPeriod}
        onChange={(jobSalaryPeriod) => patch({ jobSalaryPeriod })}
      />
      <MultiChip
        label="To'lov chastotasi"
        options={JOB_PAY_FREQUENCY_OPTIONS}
        values={form.jobPayFrequency}
        onChange={(jobPayFrequency) => patch({ jobPayFrequency })}
      />
      <ChipRow
        label="Tajriba"
        options={JOB_EXPERIENCE_OPTIONS}
        value={form.jobExperience}
        onChange={(jobExperience) => patch({ jobExperience })}
      />
      {flags.companyFlags ? (
        <>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Kompaniya tekshirilgan</Text>
            <Switch
              value={form.jobCompanyVerified}
              onValueChange={(jobCompanyVerified) => patch({ jobCompanyVerified })}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Yirik kompaniya</Text>
            <Switch value={form.jobLargeCompany} onValueChange={(jobLargeCompany) => patch({ jobLargeCompany })} />
          </View>
        </>
      ) : null}
      {flags.benefits ? (
        <MultiChip
          label="Taqdim etadi"
          options={JOB_BENEFIT_OPTIONS}
          values={form.jobBenefits}
          onChange={(jobBenefits) => patch({ jobBenefits })}
        />
      ) : null}
      <MultiChip
        label="Nomzodlar"
        options={JOB_CANDIDATE_OPTIONS}
        values={form.jobForCandidates}
        onChange={(jobForCandidates) => patch({ jobForCandidates })}
      />
      {flags.citizenship ? (
        <ChipRow
          label="Fuqarolik"
          options={JOB_CITIZENSHIP_OPTIONS}
          value={form.jobCitizenship}
          onChange={(jobCitizenship) => patch({ jobCitizenship })}
        />
      ) : null}
      {flags.age ? (
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>Yosh dan</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={form.jobAgeFrom}
              onChangeText={(jobAgeFrom) => patch({ jobAgeFrom })}
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.flex}>
            <Text style={styles.label}>gacha</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={form.jobAgeTo}
              onChangeText={(jobAgeTo) => patch({ jobAgeTo })}
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
