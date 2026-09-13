import {defineField, defineType} from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Kontakt',
  type: 'object',
  groups: [
    {name: 'main', title: 'Dane', default: true},
    {name: 'labels', title: 'Teksty okienek'},
  ],
  fields: [
    defineField({
      name: 'hook',
      title: 'Zachęta',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'title',
      title: 'Nagłówek listy kontaktów',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'linkedin',
      title: 'Adres profilu LinkedIn',
      type: 'url',
      group: 'main',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      description: 'W formie do wyświetlenia, np. +48 502 619 109',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Etykieta okienka telefonu',
      type: 'string',
      group: 'labels',
      initialValue: 'Telefon',
    }),
    defineField({
      name: 'phoneCta',
      title: 'Przycisk w okienku telefonu',
      type: 'string',
      group: 'labels',
      initialValue: 'Zadzwoń',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Etykieta okienka e-mail',
      type: 'string',
      group: 'labels',
      initialValue: 'E-mail',
    }),
    defineField({
      name: 'emailCta',
      title: 'Przycisk w okienku e-mail',
      type: 'string',
      group: 'labels',
      initialValue: 'Napisz wiadomość',
    }),
  ],
})
