// Jednorazowe zasilenie Sanity trescia, ktora wczesniej byla zaszyta w app/pages/index.vue.
// Uruchomienie: SANITY_WRITE_TOKEN=... npm run seed   (albo token w pliku .env)
// Token (rola Editor) tworzy sie w https://www.sanity.io/manage/project/tbckptwx/api#tokens
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createClient } from '@sanity/client'

const root = resolve(import.meta.dirname, '..')

async function loadDotEnv () {
  try {
    const text = await readFile(resolve(root, '.env'), 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
await loadDotEnv()

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Brak SANITY_WRITE_TOKEN (ustaw w .env albo w srodowisku).')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'tbckptwx',
  dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-01',
  useCdn: false,
  token
})

let key = 0
const k = () => `seed-${++key}`
const block = text => ({
  _type: 'block',
  _key: k(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }]
})

console.log('Wgrywam zdjecie...')
const avatar = await client.assets.upload('image', createReadStream(resolve(root, 'public/michal-melan.jpg')), {
  filename: 'michal-melan.jpg'
})

const doc = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    avatar: { _type: 'image', asset: { _type: 'reference', _ref: avatar._id }, alt: 'Michał Melan' },
    name: 'Michał Melan',
    role: 'Quality Manager',
    tagline: 'Pomagam organizacjom produkcyjnym stabilizować jakość\ni podejmować trafne decyzje wtedy, gdy pojawia się problem.'
  },
  about: {
    navLabel: 'O mnie',
    title: 'O mnie',
    body: [
      block('Jestem Interim Quality Managerem i Problem Solverem z ponad 18-letnim doświadczeniem w zarządzaniu jakością w branży przemysłowej i Automotive. Ukończyłem studia magisterskie z chemii organicznej na Uniwersytecie Jagiellońskim w Krakowie (2001–2006). Swoją ścieżkę zawodową rozpoczynałem jako specjalista ds. analiz chemicznych i laboratoryjnych, co ukształtowało moje wysoce analityczne, oparte na faktach i twardych danych podejście do rozwiązywania problemów.'),
      block('W trakcie kariery pełniłem kluczowe role menedżerskie i inżynieryjne - m.in. jako Head of Quality w AMMEGA, odpowiadając za globalną strategię jakości, a także jako Quality PTM w Valeo czy Customer Quality Engineer w Magna International. Pomyślnie wdrażałem projekty nowo uruchamianych wyrobów dla kluczowych marek branży motoryzacyjnej, w tym dla Daimler/Mercedes-Benz oraz Volkswagen.'),
      block('W swojej praktyce konsultingowej wspieram organizacje produkcyjne w stabilizacji jakości, budowaniu systemów zarządzania zgodnych z IATF 16949 / ISO 9001 oraz zarządzaniu bezpieczeństwem wyrobów. Nie rozwiązuję problemów zza biurka - pracuję bezpośrednio na hali produkcyjnej, a każdy proces uznaję za zakończony dopiero po wdrożeniu i walidacji skutecznych działań prewencyjnych.')
    ]
  },
  services: {
    navLabel: 'Co robię',
    title: 'Co robię',
    lead: 'Nie przychodzę po to, żeby przygotować kolejny raport. Przychodzę po to, żeby zrozumieć problem, zebrać właściwe dane i na ich podstawie podjąć decyzje, które doprowadzą do trwałego rozwiązania.',
    cards: [
      { title: 'Stabilizuję jakość', text: 'Wchodzę w sytuacje, w których potrzebne jest szybkie uporządkowanie jakości, wsparcie zespołu lub przejęcie całościowej odpowiedzialności za obszar.' },
      { title: 'Wspieram produkcję', text: 'Rozmawiam z ludźmi, obserwuję proces i sprawdzam, co naprawdę dzieje się na hali. Nie rozwiązuję problemów zza biurka.' },
      { title: 'Podejmuję decyzje na podstawie faktów', text: 'Rozwiązuję każdy problem krok po kroku: definiuję go, zbieram zespół, analizuję dane, zawężam potencjalne przyczyny, potwierdzam je i dopiero wtedy podejmuję decyzje.' },
      { title: 'Przekładam analizę na działanie', text: 'Nie zatrzymuję się na analizie. Nigdy nie wytykam błędów. Wykorzystuję wynik problem solvingu do wyboru konkretnych działań, wdrożenia zmian i zabezpieczenia procesu.' },
      { title: 'Deeskaluję sytuacje u Klientów', text: 'Pomagam opanować sytuacje kryzysowe u Klienta, ograniczyć eskalację i szybko przywrócić poczucie kontroli. Następnie przechodzę od reakcji do ustrukturyzowanego problem solvingu.' },
      { title: 'Jestem dyskretny', text: 'Sytuacja wymaga NDA? Nie ma problemu.' }
    ].map(c => ({ _type: 'serviceCard', _key: k(), ...c }))
  },
  experience: {
    navLabel: 'Doświadczenie zawodowe',
    title: 'Doświadczenie zawodowe',
    jobs: [
      { role: 'Właściciel', company: 'Interim Quality Management', place: 'Polska', period: 'mar 2026 – obecnie' },
      { role: 'Head of Quality – Modular division', company: 'AMMEGA', place: 'Katowice', period: 'cze 2023 – lut 2026' },
      { role: 'Kierownik laboratorium', company: 'Magna International', place: 'Dąbrowa Górnicza', period: 'kwi 2021 – cze 2023' },
      { role: 'Customer Quality Engineer', company: 'Magna International', place: 'Katowice', period: 'cze 2019 – mar 2021' },
      { role: 'Quality PTM', company: 'Valeo', place: 'Chrzanów', period: 'gru 2016 – maj 2019' },
      { role: 'Quality Engineer', company: 'Rockwell Automation', place: 'Katowice', period: 'lis 2014 – gru 2016' },
      { role: 'QMP Quality Engineer', company: 'Automotive Lighting', place: 'Sosnowiec', period: 'lis 2012 – lis 2014' },
      { role: 'Senior Quality Specialist', company: 'Keiper', place: 'Świebodzin', period: 'lut 2011 – lis 2012' },
      { role: 'Analysis Specialist', company: 'MAN Truck & Bus Polska', place: 'Niepołomice', period: 'wrz 2010 – lut 2011' },
      { role: 'Chemical Analysis Specialist', company: 'British American Tobacco', place: 'Myślenice', period: 'lip 2006 – wrz 2010' }
    ].map(j => ({ _type: 'job', _key: k(), ...j }))
  },
  contact: {
    hook: 'Masz problem z jakością?',
    title: 'Skontaktuj się:',
    linkedin: 'https://www.linkedin.com/in/micha%C5%82-melan-274a81177/',
    phone: '+48 502 619 109',
    email: 'michal@melan.pl',
    phoneLabel: 'Telefon',
    phoneCta: 'Zadzwoń',
    emailLabel: 'E-mail',
    emailCta: 'Napisz wiadomość'
  },
  seo: {
    title: 'Michał Melan – Quality Manager',
    description: 'Interim Quality Manager i Problem Solver z ponad 18-letnim doświadczeniem w zarządzaniu jakością w branży przemysłowej i Automotive.'
  }
}

console.log('Zapisuję dokument homePage...')
await client.createOrReplace(doc)
console.log('Gotowe. Treść dostępna w /studio.')
