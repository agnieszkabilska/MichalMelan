import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

// Buduje adresy obrazkow z CDN Sanity z uwzglednieniem kadru/hotspotu z Studio.
export function useSanityImageUrl () {
  const { projectId, dataset } = useSanityConfig()
  const builder = createImageUrlBuilder({ projectId, dataset })
  return (source: SanityImageSource) => builder.image(source).auto('format')
}
