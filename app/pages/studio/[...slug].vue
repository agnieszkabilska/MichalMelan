<script setup lang="ts">
// Sanity Studio (React) osadzone w Nuxt. Strona renderuje sie tylko w przegladarce
// (routeRules '/studio/**' -> ssr: false), a paczka `sanity` ladowana jest dynamicznie,
// zeby nie trafic do bundla serwerowego.
definePageMeta({ layout: false })

useHead({
  title: 'Sanity Studio – Michał Melan',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  htmlAttrs: { lang: 'pl' }
})

const root = ref<HTMLElement | null>(null)
let unmount: (() => void) | undefined

onMounted(async () => {
  const [{ renderStudio }, { default: config }] = await Promise.all([
    import('sanity'),
    import('../../../studio/sanity.config')
  ])
  if (root.value) {
    unmount = renderStudio(root.value, config, { reactStrictMode: false })
  }
})

onBeforeUnmount(() => {
  unmount?.()
})
</script>

<template>
  <div ref="root" class="studio-root" />
</template>

<style>
.studio-root {
  position: fixed;
  inset: 0;
}
</style>
