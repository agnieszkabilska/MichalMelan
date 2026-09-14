import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  groups: [
    {name: 'search', title: 'Wyszukiwarki', default: true},
    {name: 'social', title: 'Podgląd linku (LinkedIn, Facebook, Messenger)'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł strony (zakładka przeglądarki, wynik w Google)',
      type: 'string',
      group: 'search',
      validation: (rule) => rule.required().max(70).warning('Google ucina tytuły dłuższe niż ~60–70 znaków'),
    }),
    defineField({
      name: 'description',
      title: 'Opis strony (Google)',
      type: 'text',
      rows: 3,
      group: 'search',
      validation: (rule) =>
        rule.required().max(160).warning('Google ucina opisy dłuższe niż ~160 znaków'),
    }),
    defineField({
      name: 'keywords',
      title: 'Słowa kluczowe',
      description: 'Opcjonalne. Po jednym haśle, np. „interim quality manager”, „IATF 16949”.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'search',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Tytuł w podglądzie linku',
      description: 'Puste = tytuł strony.',
      type: 'string',
      group: 'social',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Opis w podglądzie linku',
      description: 'Puste = opis strony.',
      type: 'text',
      rows: 3,
      group: 'social',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Własny obrazek podglądu',
      description:
        'Opcjonalny, najlepiej 1200×630 px. Jeśli pusty, obrazek jest generowany automatycznie ze zdjęcia, imienia, stanowiska i hasła.',
      type: 'image',
      options: {hotspot: true},
      group: 'social',
      fields: [
        defineField({
          name: 'alt',
          title: 'Tekst alternatywny',
          type: 'string',
        }),
      ],
    }),
  ],
})
