import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageObject } from '@sanity/image-url'

export interface HomePage {
  hero: {
    avatar?: SanityImageObject & { alt?: string }
    name: string
    role: string
    tagline: string
  }
  about: { navLabel: string, title: string, body: PortableTextBlock[] }
  services: {
    navLabel: string
    title: string
    lead?: string
    cards: { _key: string, title: string, text: string }[]
  }
  experience: {
    navLabel: string
    title: string
    jobs: { _key: string, role: string, company: string, place?: string, period: string }[]
  }
  contact: {
    hook?: string
    title?: string
    linkedin?: string
    phone?: string
    email?: string
    phoneLabel?: string
    phoneCta?: string
    emailLabel?: string
    emailCta?: string
  }
  seo: { title: string, description: string }
}

// Jeden dokument-singleton "homePage" (zob. studio/schemaTypes/homePage.ts)
const query = groq`*[_id == "homePage"][0]{
  hero,
  about,
  services,
  experience,
  contact,
  seo
}`

export function useHomePage () {
  return useSanityQuery<HomePage | null>(query)
}
