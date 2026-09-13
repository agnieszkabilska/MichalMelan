import {defineField, defineType} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'Sekcja „O mnie”',
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
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Akapit', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Pogrubienie', value: 'strong'},
              {title: 'Kursywa', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'Adres'}],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
})
