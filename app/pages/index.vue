<script setup lang="ts">
// Cala tresc strony pochodzi z Sanity (dokument "homePage", edytowalny pod /studio).
const { data: page } = await useHomePage()

if (!page.value) {
  throw createError({
    statusCode: 503,
    statusMessage: 'Brak treści w Sanity – uruchom `npm run seed` albo uzupełnij dokument w /studio.',
    fatal: true
  })
}

const hero = computed(() => page.value!.hero)
const about = computed(() => page.value!.about)
const services = computed(() => page.value!.services)
const experience = computed(() => page.value!.experience)
const contact = computed(() => page.value!.contact)

const urlFor = useSanityImageUrl()
const avatarSrc = computed(() =>
  hero.value.avatar?.asset
    ? urlFor(hero.value.avatar).width(512).height(512).fit('crop').url()
    : '/michal-melan.jpg'
)
const taglineLines = computed(() =>
  hero.value.tagline.split('\n').map(line => line.trim()).filter(Boolean)
)

// Dane kontaktowe - href wyliczane z wartosci do wyswietlenia
const phoneHref = computed(() => 'tel:' + (contact.value.phone ?? '').replace(/[^\d+]/g, ''))
const emailHref = computed(() => 'mailto:' + (contact.value.email ?? ''))

// Okienko pokazujace dane kontaktowe przed przekierowaniem
interface ModalData { label: string, value: string, href: string, cta: string }
const modal = ref<ModalData | null>(null)
const ctaLink = ref<HTMLAnchorElement | null>(null)

function openModal (data: ModalData) {
  modal.value = data
  nextTick(() => ctaLink.value?.focus())
}
function openPhone () {
  openModal({
    label: contact.value.phoneLabel || 'Telefon',
    value: contact.value.phone || '',
    href: phoneHref.value,
    cta: contact.value.phoneCta || 'Zadzwoń'
  })
}
function openEmail () {
  openModal({
    label: contact.value.emailLabel || 'E-mail',
    value: contact.value.email || '',
    href: emailHref.value,
    cta: contact.value.emailCta || 'Napisz wiadomość'
  })
}
function closeModal () {
  modal.value = null
}
function onKeydown (e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

// Identyfikatory sekcji sa stale (kotwice, scroll-spy); etykiety pochodza z Sanity
const nav = computed(() => [
  { id: 'o-mnie', label: about.value.navLabel },
  { id: 'co-robie', label: services.value.navLabel },
  { id: 'doswiadczenie', label: experience.value.navLabel }
])

const active = ref(0)
const progress = ref(0)

let sections: HTMLElement[] = []
let ticking = false

function measure () {
  const mid = window.innerHeight * 0.4
  let current = 0
  for (const el of sections) {
    if (el.getBoundingClientRect().top <= mid) current = Number(el.dataset.nav)
  }
  active.value = current

  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  ticking = false
}

function onScroll () {
  if (ticking) return
  ticking = true
  requestAnimationFrame(measure)
}

onMounted(() => {
  sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'))
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKeydown)
})

function goTo (id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- SEO / Open Graph / dane strukturalne ----------
const seo = computed(() => page.value!.seo)
const siteUrl = useSiteConfig().url
const canonical = siteUrl.replace(/\/$/, '') + '/'

const ogTitle = computed(() => seo.value.ogTitle || seo.value.title)
const ogDescription = computed(() => seo.value.ogDescription || seo.value.description)
const avatarAbsolute = computed(() =>
  hero.value.avatar?.asset
    ? urlFor(hero.value.avatar).width(600).height(600).fit('crop').url()
    : canonical + 'michal-melan.jpg'
)

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  robots: 'index, follow',
  ogType: 'profile',
  ogLocale: 'pl_PL',
  ogSiteName: () => hero.value.name,
  ogUrl: canonical,
  ogTitle,
  ogDescription,
  twitterCard: 'summary_large_image',
  twitterTitle: ogTitle,
  twitterDescription: ogDescription
})

// og:image - wlasny obrazek z Sanity, a gdy go brak: generowany z tresci strony (app/components/OgImage/Home.vue)
if (seo.value.ogImage?.asset) {
  const customOg = urlFor(seo.value.ogImage).width(1200).height(630).fit('crop').format('jpg').url()
  useSeoMeta({
    ogImage: customOg,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    ogImageAlt: seo.value.ogImage.alt || ogTitle.value,
    twitterImage: customOg,
    twitterImageAlt: seo.value.ogImage.alt || ogTitle.value
  })
} else {
  defineOgImage('Home', {
    name: hero.value.name,
    role: hero.value.role,
    tagline: hero.value.tagline,
    avatar: avatarAbsolute.value,
    siteUrl
  }, { alt: ogTitle.value })
}

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: hero.value.name,
  jobTitle: hero.value.role,
  description: seo.value.description,
  url: canonical,
  image: avatarAbsolute.value,
  email: contact.value.email ? 'mailto:' + contact.value.email : undefined,
  telephone: contact.value.phone || undefined,
  sameAs: contact.value.linkedin ? [contact.value.linkedin] : undefined,
  knowsAbout: services.value.cards.map(c => c.title),
  worksFor: experience.value.jobs[0]
    ? { '@type': 'Organization', name: experience.value.jobs[0].company }
    : undefined
}))

useHead({
  htmlAttrs: { lang: 'pl' },
  meta: [{ name: 'keywords', content: () => seo.value.keywords?.join(', ') || '' }],
  link: [{ rel: 'canonical', href: canonical }],
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify(jsonLd.value)
  }]
})
</script>

<template>
  <div class="layout">
    <!-- LEWA STRONA - nieruchoma (strona 1 PDF) -->
    <aside class="pane">
      <div class="pane-inner">
        <div class="intro">
          <header class="hero">
            <div class="avatar">
              <img :src="avatarSrc" :alt="hero.avatar?.alt || hero.name" width="512" height="512" fetchpriority="high" decoding="async">
            </div>
            <div class="hero-text">
              <h1>{{ hero.name }}</h1>
              <p class="role">{{ hero.role }}</p>
            </div>
          </header>

          <p class="tagline">
            <template v-for="(line, i) in taglineLines" :key="i">
              <br v-if="i > 0">{{ line }}
            </template>
          </p>
        </div>

        <nav class="nav" aria-label="Sekcje strony">
          <button
            v-for="(item, i) in nav"
            :key="item.id"
            class="nav-item"
            :class="{ 'is-active': active === i }"
            type="button"
            :aria-current="active === i ? 'true' : undefined"
            @click="goTo(item.id)"
          >
            <span class="nav-line" />
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </nav>

        <footer class="contact">
          <p v-if="contact.hook" class="contact-hook">{{ contact.hook }}</p>
          <p v-if="contact.title" class="contact-title">{{ contact.title }}</p>
          <ul class="contact-list">
            <li v-if="contact.linkedin">
              <a :href="contact.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3v-11zm7 0h3.8v1.5h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.75v5.7h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.31-2.02 2.66v5.14h-4v-11z" /></svg>
              </a>
            </li>
            <li v-if="contact.phone">
              <button type="button" :aria-label="contact.phoneLabel || 'Telefon'" aria-haspopup="dialog" @click="openPhone">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z" /></svg>
              </button>
            </li>
            <li v-if="contact.email">
              <button type="button" :aria-label="contact.emailLabel || 'E-mail'" aria-haspopup="dialog" @click="openEmail">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm1.6 2L12 13.2 19.4 7H4.6zM4 8.9V17h16V8.9l-7.4 6.2c-.35.3-.85.3-1.2 0L4 8.9z" /></svg>
              </button>
            </li>
          </ul>
        </footer>
      </div>
    </aside>

    <!-- SZYNA MIEDZY KOLUMNAMI - postep czytania strony -->
    <div class="divider" aria-hidden="true">
      <span class="divider-rail">
        <span class="divider-fill" :style="{ transform: 'scaleY(' + progress + ')' }" />
        <span class="divider-marks">
          <span v-for="(item, i) in nav" :key="item.id" :class="{ 'is-done': active >= i }" />
        </span>
      </span>
    </div>

    <!-- PRAWA STRONA - przewijana (strony 2-6 PDF), na wlasnej "kartce" -->
    <main class="content">
      <section id="o-mnie" class="section" data-nav="0">
        <h2 class="section-title">{{ about.title }}</h2>
        <SanityContent :value="about.body" />
      </section>

      <section id="co-robie" class="section" data-nav="1">
        <h2 class="section-title">{{ services.title }}</h2>
        <p v-if="services.lead" class="lead">{{ services.lead }}</p>
        <ul class="cards">
          <li v-for="card in services.cards" :key="card._key" class="card">
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </li>
        </ul>
      </section>

      <section id="doswiadczenie" class="section" data-nav="2">
        <h2 class="section-title">{{ experience.title }}</h2>
        <ol class="timeline">
          <li v-for="job in experience.jobs" :key="job._key" class="job">
            <h3 class="job-role">
              {{ job.role }}
              <span class="dot" aria-hidden="true" />
              <span class="job-company">{{ job.company }}</span>
              <template v-if="job.place">
                <span class="dot" aria-hidden="true" />
                <span class="job-company">{{ job.place }}</span>
              </template>
            </h3>
            <p class="job-period">{{ job.period }}</p>
          </li>
        </ol>
      </section>
    </main>

    <!-- OKIENKO Z DANYMI KONTAKTOWYMI -->
    <Transition name="fade">
      <div v-if="modal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button class="modal-close" type="button" aria-label="Zamknij" @click="closeModal">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5z" /></svg>
          </button>
          <p id="modal-title" class="modal-label">{{ modal.label }}</p>
          <p class="modal-value">{{ modal.value }}</p>
          <a ref="ctaLink" class="modal-call" :href="modal.href">{{ modal.cta }}</a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
:root {
  --bg: #ececea;
  /* podloze prawej kolumny - odcien cieplejszy i tylko odrobine jasniejszy od tla */
  --sheet: #f3f1eb;
  --ink: #111111;
  --purple: #5b21e0;
  /* ciemniejszy wariant do cienkich elementow - na jasnym tle 2px w --purple
     ma za maly kontrast i czyta sie jako cienszy pasek niz czarny */
  --purple-ink: #3a0f9e;
  --muted: #4a4a48;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
</style>

<style scoped>
.layout {
  --pane-w: 50vw;
  min-height: 100vh;
}

/* ---------- LEWA, NIERUCHOMA KOLUMNA ---------- */
.pane {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--pane-w);
  display: flex;
  padding: clamp(1.5rem, 4.5vh, 3rem) clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3vh, 2.25rem) clamp(1.5rem, 4.5vw, 5rem);
  overflow-y: auto;
}

.pane-inner {
  flex: 1;
  width: 100%;
  max-width: 33rem;
  margin: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
}

.hero {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 2rem);
}

.avatar {
  flex: none;
  width: clamp(5rem, 7vw, 7.5rem);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 5px solid var(--purple);
  padding: 4px;
  background: var(--bg);
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.hero-text h1 {
  margin: 0;
  font-size: clamp(1.7rem, 2.8vw, 2.9rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.05;
  white-space: nowrap;
}

.role {
  margin: 0.15em 0 0;
  color: var(--purple);
  font-size: clamp(1.05rem, 1.6vw, 1.65rem);
  font-weight: 400;
  letter-spacing: -0.01em;
}

.tagline {
  margin: clamp(1.25rem, 3vh, 2rem) 0 0;
  font-size: clamp(0.9rem, 1.05vw, 1.05rem);
  line-height: 1.55;
  color: var(--muted);
}

/* ---------- PASKI NAWIGACJI ---------- */
.nav {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.8vh, 1.9rem);
}

/* uklad flex, wiec rosnacy pasek wypycha napis w prawo */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.3rem 0;
  background: none;
  border: 0;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

/* wszystkie paski maja te sama grubosc (2px) i te sama szerokosc bazowa.
   Aktywny wydluza sie, wypychajac napis w prawo, i przyjmuje kolor napisu. */
.nav-line {
  flex: none;
  display: block;
  height: 2px;
  width: clamp(1.75rem, 2.6vw, 2.6rem);
  background: var(--ink);
  transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.35s ease;
}

.nav-item.is-active .nav-line {
  width: clamp(4rem, 6.5vw, 6.5rem);
  background: var(--purple-ink);
}

.nav-label {
  font-size: clamp(0.85rem, 1.05vw, 1.1rem);
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition: color 0.35s ease;
}

.nav-item.is-active .nav-label {
  color: var(--purple-ink);
}

/* ---------- KONTAKT ---------- */
.contact-hook {
  margin: 0 0 0.25rem;
  font-size: clamp(0.95rem, 1.2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.contact-title {
  margin: 0 0 0.8rem;
  font-size: clamp(0.85rem, 1.02vw, 1rem);
}

.contact-list {
  display: flex;
  gap: 0.7rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact-list a,
.contact-list button {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: none;
  border-radius: 50%;
  border: 1.5px dashed #8d8d8b;
  color: var(--ink);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.contact-list a:hover,
.contact-list button:hover {
  color: var(--purple);
  border-color: var(--purple);
  transform: translateY(-2px);
}

.contact-list svg {
  width: 1.15rem;
  height: 1.15rem;
  fill: currentColor;
}

/* ---------- OKIENKO Z NUMEREM TELEFONU ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(17, 17, 17, 0.28);
  backdrop-filter: blur(3px);
}

.modal {
  position: relative;
  width: min(24rem, 100%);
  padding: 2.75rem 2rem 2rem;
  text-align: center;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(22px) saturate(170%);
  box-shadow: 0 24px 60px rgba(17, 17, 17, 0.3);
}

.modal-close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 50%;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.modal-close:hover {
  color: var(--ink);
  background: rgba(17, 17, 17, 0.07);
}

.modal-close svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: currentColor;
}

.modal-label {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.modal-value {
  margin: 0.5rem 0 1.75rem;
  font-size: clamp(1.35rem, 3.2vw, 1.8rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.modal-call {
  display: inline-block;
  padding: 0.85rem 2.25rem;
  background: var(--purple);
  border-radius: 0.9rem;
  border: 2px solid var(--ink);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.modal-call:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- SZYNA MIEDZY KOLUMNAMI ---------- */
.divider {
  position: fixed;
  top: 0;
  bottom: 0;
  left: calc(var(--pane-w) - 2.25rem);
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 5;
}

.divider-rail {
  position: relative;
  width: 2px;
  height: 58vh;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.14);
}

.divider-fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--purple-ink);
  transform-origin: top center;
  transform: scaleY(0);
}

.divider-marks {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* halo w kolorze tla odcina kropke od szyny, zeby nie zlewala sie z wypelnieniem */
.divider-marks span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--bg);
  box-shadow: 0 0 0 3px var(--bg), inset 0 0 0 2px rgba(17, 17, 17, 0.22);
  transition: box-shadow 0.35s ease, background-color 0.35s ease;
}

.divider-marks span.is-done {
  background: var(--purple-ink);
  box-shadow: 0 0 0 3px var(--bg), inset 0 0 0 2px var(--purple-ink);
}

/* ---------- PRAWA, PRZEWIJANA KOLUMNA ---------- */
/* "kartka" pod prawa kolumna - odsunieta od kazdej krawedzi, zeby zaokraglenie
   bylo widoczne ze wszystkich stron i nic nie uciekalo poza ekran */
.content {
  margin: clamp(1rem, 2.5vh, 2rem) clamp(1rem, 2.5vw, 2.5rem) clamp(1rem, 2.5vh, 2rem) var(--pane-w);
  /* wiekszy zapas z prawej, zeby kolumna ciazyla ku srodkowi ekranu */
  padding: 0 clamp(2rem, 5vw, 5.5rem) 0 clamp(1.5rem, 3.5vw, 4rem);
  background: var(--sheet);
  border-radius: 2rem;
  border: 1px solid rgba(17, 17, 17, 0.06);
  box-shadow: 0 18px 50px rgba(17, 17, 17, 0.07);
}

.section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(4rem, 10vh, 8rem) 0;
  max-width: 60rem;
}

.section-title {
  margin: 0 0 2rem;
  font-size: clamp(1.6rem, 2.4vw, 2.4rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.section :deep(p) {
  margin: 0 0 1.1em;
  font-size: clamp(0.95rem, 1.1vw, 1.1rem);
  line-height: 1.75;
  text-align: justify;
  hyphens: auto;
}

.lead {
  max-width: 52rem;
  font-weight: 500;
}

/* ---------- KARTY "CO ROBIĘ" ---------- */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.card {
  background: var(--purple);
  border-radius: 1.25rem;
  border: 2px solid var(--ink);
  color: #fff;
  padding: 1.25rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* tytul rezerwuje stala liczbe wierszy, dzieki czemu akapity
   we wszystkich kafelkach w rzedzie zaczynaja sie na tej samej wysokosci */
.card h3 {
  margin: 0;
  min-height: 3.9em;
  font-size: 0.95rem;
  line-height: 1.3;
  text-align: left;
  text-wrap: balance;
}

.card p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.55;
  text-align: left;
  color: rgba(255, 255, 255, 0.92);
}

/* ---------- OS CZASU ---------- */
.timeline {
  /* odleglosc srodka szyny (i srodka kropek) od lewej krawedzi listy */
  --rail-x: 1.5rem;
  --dot-size: 1rem;
  --gap: clamp(2rem, 5vh, 3.25rem);
  margin: 0;
  padding: 0 0 0 calc(var(--rail-x) * 2);
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

.job {
  position: relative;
  /* stopien pisma tytulu trzymany tutaj, zeby 'em' znaczylo to samo
     dla kropki i dla odcinka szyny */
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  line-height: 1.35;
}

/* kropka na wysokosci srodka pierwszej linii tytulu */
.job-role::before {
  content: '';
  position: absolute;
  left: calc(var(--dot-size) / -2 - var(--rail-x));
  top: calc(0.675em - var(--dot-size) / 2);
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: var(--purple);
}

/* odcinek szyny prowadzacy od tej kropki dokladnie do nastepnej */
.job:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(var(--rail-x) * -1 - 1px);
  top: 0.675em;
  width: 2px;
  height: calc(100% + var(--gap));
  background: var(--purple);
}

.job-role {
  position: relative;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.job-company {
  font-weight: 400;
}

.dot {
  display: inline-block;
  width: 0.3em;
  height: 0.3em;
  margin: 0 0.55em;
  border-radius: 50%;
  background: var(--ink);
  vertical-align: 0.2em;
}

.job-period {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--muted);
  text-align: left;
}

/* ponizej tej szerokosci jedna linia przestaje sie miescic czytelnie */
@media (max-width: 1100px) {
  .job-role {
    white-space: normal;
  }
}

/* ---------- MOBILE ---------- */
@media (max-width: 900px) {
  .pane {
    position: static;
    width: auto;
    min-height: auto;
    padding: 3.5rem 1.25rem;
  }

  .pane-inner {
    max-width: 34rem;
    justify-content: flex-start;
    gap: 2.75rem;
  }

  .divider {
    display: none;
  }

  .content {
    margin: 0 0.75rem 0.75rem;
    padding: 1.5rem 1.25rem;
    border-radius: 1.5rem;
  }

  .section {
    min-height: auto;
    padding: 3.5rem 0;
  }

  .section :deep(p) {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-line {
    transition: none;
  }
}
</style>
