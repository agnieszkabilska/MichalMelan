import {defineField, defineType} from 'sanity'

export const jobType = defineType({
  name: 'job',
  title: 'Stanowisko',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Stanowisko',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Firma',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'place',
      title: 'Miejscowość',
      type: 'string',
    }),
    defineField({
      name: 'period',
      title: 'Okres',
      description: 'np. „cze 2023 – lut 2026” albo „mar 2026 – obecnie”',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'role', company: 'company', period: 'period'},
    prepare: ({title, company, period}) => ({
      title,
      subtitle: [company, period].filter(Boolean).join(' · '),
    }),
  },
})

export const experienceType = defineType({
  name: 'experience',
  title: 'Sekcja „Doświadczenie zawodowe”',
  type: 'object',
  fields: [
    defineField({
      name: 'navLabel',
      title: 'Nazwa w nawigacji',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Tytuł sekcji',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobs',
      title: 'Stanowiska (od najnowszego)',
      type: 'array',
      of: [{type: 'job'}],
      validation: (rule) => rule.min(1),
    }),
  ],
})
