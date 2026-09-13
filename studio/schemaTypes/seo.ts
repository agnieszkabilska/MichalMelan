import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł strony (zakładka przeglądarki)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Opis strony (Google)',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.required().max(160).warning('Google ucina opisy dłuższe niż ~160 znaków'),
    }),
  ],
})
