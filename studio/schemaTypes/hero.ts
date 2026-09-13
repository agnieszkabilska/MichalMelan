import {defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Nagłówek (lewa kolumna)',
  type: 'object',
  fields: [
    defineField({
      name: 'avatar',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Tekst alternatywny',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Imię i nazwisko',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Stanowisko',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Hasło pod nagłówkiem',
      description: 'Każda linia w tym polu będzie osobną linią na stronie.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
})
