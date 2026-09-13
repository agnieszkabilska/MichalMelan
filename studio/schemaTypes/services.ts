import {defineField, defineType} from 'sanity'

export const serviceCardType = defineType({
  name: 'serviceCard',
  title: 'Karta',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Opis',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
})

export const servicesType = defineType({
  name: 'services',
  title: 'Sekcja „Co robię”',
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
      name: 'lead',
      title: 'Wstęp',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'cards',
      title: 'Karty',
      type: 'array',
      of: [{type: 'serviceCard'}],
      validation: (rule) => rule.min(1),
    }),
  ],
})
