import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemaTypes'
import {HOME_PAGE_ID} from './schemaTypes/homePage'

// Dokumenty-singletony: jeden egzemplarz, bez tworzenia/usuwania.
const singletonTypes = new Set(['homePage'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Michał Melan',
  basePath: '/studio',

  projectId: 'tbckptwx',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Treść')
          .items([
            S.listItem()
              .title('Strona główna')
              .id(HOME_PAGE_ID)
              .child(S.document().schemaType('homePage').documentId(HOME_PAGE_ID)),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Nie pokazuj singletonów w menu "Utwórz nowy dokument".
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Singleton nie może zostać usunięty ani zduplikowany.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
})
