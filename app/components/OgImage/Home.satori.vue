<script setup lang="ts">
// Szablon obrazka og:image (1200x630) renderowany przez satori.
// Satori obsluguje tylko flexbox i style inline - bez grid, bez klas CSS.
const props = withDefaults(defineProps<{
  name: string
  role: string
  tagline?: string
  avatar?: string
  siteUrl?: string
}>(), {
  tagline: '',
  avatar: '',
  siteUrl: ''
})

const taglineLines = computed(() =>
  props.tagline.split('\n').map(l => l.trim()).filter(Boolean)
)
const host = computed(() => props.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      backgroundColor: '#ececea',
      padding: '48px',
      fontFamily: 'Inter'
    }"
  >
    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f1eb',
        border: '3px solid #111111',
        borderRadius: '28px',
        padding: '56px 64px'
      }"
    >
      <div
        v-if="avatar"
        :style="{
          display: 'flex',
          width: '300px',
          height: '300px',
          borderRadius: '150px',
          border: '3px solid #111111',
          overflow: 'hidden',
          flexShrink: 0,
          marginRight: '64px'
        }"
      >
        <img :src="avatar" width="300" height="300" :style="{ width: '300px', height: '300px', objectFit: 'cover' }">
      </div>

      <div :style="{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, height: '100%', justifyContent: 'center' }">
        <div :style="{ display: 'flex', fontSize: '72px', fontWeight: 700, color: '#111111', letterSpacing: '-2px', lineHeight: 1.05 }">
          {{ name }}
        </div>
        <div :style="{ display: 'flex', fontSize: '34px', fontWeight: 600, color: '#5b21e0', marginTop: '10px' }">
          {{ role }}
        </div>
        <div
          v-if="taglineLines.length"
          :style="{ display: 'flex', flexDirection: 'column', marginTop: '36px', fontSize: '24px', color: '#4a4a48', lineHeight: 1.4, maxWidth: '640px' }"
        >
          <div v-for="(line, i) in taglineLines" :key="i" :style="{ display: 'flex', flexWrap: 'wrap', textWrap: 'balance' }">{{ line }}</div>
        </div>
        <div v-if="host" :style="{ display: 'flex', marginTop: 'auto', fontSize: '22px', fontWeight: 600, color: '#3a0f9e' }">
          {{ host }}
        </div>
      </div>
    </div>
  </div>
</template>
