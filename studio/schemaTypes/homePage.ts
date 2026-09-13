import {defineField, defineType} from 'sanity'

export const HOME_PAGE_ID = 'homePage'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Strona główna',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Nagłówek', default: true},
    {name: 'about', title: 'O mnie'},
    {name: 'services', title: 'Co robię'},
    {name: 'experience', title: 'Doświadczenie'},
    {name: 'contact', title: 'Kontakt'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'hero', title: 'Nagłówek', type: 'hero', group: 'hero'}),
    defineField({name: 'about', title: 'O mnie', type: 'about', group: 'about'}),
    defineField({name: 'services', title: 'Co robię', type: 'services', group: 'services'}),
    defineField({
      name: 'experience',
      title: 'Doświadczenie zawodowe',
      type: 'experience',
      group: 'experience',
    }),
    defineField({name: 'contact', title: 'Kontakt', type: 'contact', group: 'contact'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Strona główna'}),
  },
})
