# Michał Melan – strona wizytówka

Nuxt 4 + Sanity CMS. Cała treść strony (nagłówek, „O mnie”, „Co robię”, doświadczenie, kontakt, SEO)
jest edytowalna przez właściciela w Sanity Studio pod adresem **`/studio`**.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000  (Studio: http://localhost:3000/studio)
```

## Edycja treści

1. Wejdź na `https://<domena>/studio` i zaloguj się kontem, które ma dostęp do projektu Sanity `tbckptwx`.
2. Otwórz „Strona główna” – sekcje są pogrupowane w zakładki (Nagłówek, O mnie, Co robię, Doświadczenie, Kontakt, SEO).
3. Kliknij **Publish**. Zmiany są widoczne na stronie od razu po odświeżeniu (treść renderowana jest serwerowo przy każdym żądaniu, z CDN Sanity).

Struktura treści: `studio/schemaTypes/` (jeden dokument-singleton `homePage`).

## Pierwsze zasilenie treścią (seed)

Dataset startuje pusty – strona zwraca wtedy 503 z komunikatem. Aby wgrać dotychczasową treść:

1. Utwórz token z rolą **Editor**: https://www.sanity.io/manage/project/tbckptwx/api#tokens
2. Skopiuj `.env.example` do `.env` i wpisz `SANITY_WRITE_TOKEN=...`
3. `npm run seed`

Token jest potrzebny tylko do seeda – strona czyta dane publicznie, bez sekretów.

## CORS (logowanie do Studio)

Studio łączy się z API Sanity z przeglądarki, więc każdy adres, pod którym działa strona, musi być dodany
do CORS origins projektu **z opcją „Allow credentials”**:

```bash
npm run sanity -- login
npm run sanity -- cors add http://localhost:3000 --credentials
npm run sanity -- cors add https://<domena-produkcyjna> --credentials
npm run sanity -- cors add https://*.vercel.app --credentials   # podglądy Vercel (opcjonalnie)
```

(albo ręcznie: https://www.sanity.io/manage/project/tbckptwx/api#cors-origins)

## SEO i podgląd linku (Open Graph)

- Meta tagi (`title`, `description`, `og:*`, `twitter:*`, canonical, JSON-LD `Person`) budowane są z sekcji **SEO** dokumentu w Studio.
  Zakładka „Podgląd linku” pozwala nadpisać tytuł/opis widoczne na LinkedIn, Facebooku, Messengerze.
- Obrazek `og:image` (1200×630) jest **generowany automatycznie** (`nuxt-og-image`, szablon `app/components/OgImage/Home.satori.vue`)
  ze zdjęcia, imienia, stanowiska i hasła. W Studio można wgrać własny obrazek („Własny obrazek podglądu”) – wtedy zastępuje generowany.
- Podgląd wygenerowanego obrazka w dev: adres z `og:image` w źródle strony, albo Nuxt DevTools → OG Image.
- Fonty do obrazka: Inter (latin + latin-ext, `public/fonts/`, deklaracje w `app/assets/css/og-fonts.css`) – potrzebne dla polskich znaków; strona sama używa fontów systemowych.
- `robots.txt` i `sitemap.xml` generują moduły `@nuxtjs/robots` i `@nuxtjs/sitemap`; `/studio` jest wykluczone z indeksowania.
- Adres kanoniczny: `site.url` w `nuxt.config.ts` (`https://www.melan.pl`), nadpisywalny przez `NUXT_SITE_URL`.
- Weryfikacja po deployu: https://www.opengraph.xyz lub LinkedIn Post Inspector (https://www.linkedin.com/post-inspector/).
  LinkedIn i Facebook cache’ują podgląd ok. 7 dni – po zmianie obrazka użyj inspektora, żeby odświeżyć.

## Wdrożenie na Vercel

- Framework: Nuxt (wykrywany automatycznie), build `npm run build`, brak wymaganych zmiennych środowiskowych.
- Zalecane: `NUXT_OG_IMAGE_SECRET` (stały sekret podpisujący URL-e og:image; `npx nuxt-og-image generate-secret`) – bez niego adres obrazka zmienia się po każdym deployu.
- Opcjonalne nadpisania: `NUXT_SITE_URL`, `NUXT_PUBLIC_SANITY_PROJECT_ID`, `NUXT_PUBLIC_SANITY_DATASET`.
- Po pierwszym deployu dodaj domenę do CORS (patrz wyżej).

## Skrypty

| Skrypt | Opis |
|---|---|
| `npm run dev` | serwer deweloperski |
| `npm run build` | build produkcyjny (to samo uruchamia Vercel) |
| `npm run seed` | jednorazowe zasilenie Sanity treścią |
| `npm run sanity -- <cmd>` | Sanity CLI w kontekście `studio/` (np. `manage`, `cors list`, `dataset export`) |

## Podpięcie domeny z home.pl do Vercela

Domena pozostaje w home.pl (rejestrator i DNS), zmieniamy tylko rekordy DNS, żeby wskazywały na Vercel.

### 1. Dodaj domenę w Vercelu

1. Vercel → projekt → **Settings → Domains → Add**.
2. Wpisz domenę główną, np. `michalmelan.pl`, zatwierdź. Vercel sam zaproponuje też `www.michalmelan.pl` – dodaj obie
   i ustaw przekierowanie `www` → domena główna (lub odwrotnie, wg preferencji).
3. Vercel pokaże, jakie rekordy DNS trzeba ustawić (zwykle: rekord **A** dla domeny głównej i **CNAME** dla `www`).
   Skopiuj wartości dokładnie z tego ekranu – poniższe są standardowe, ale ekran Vercela jest źródłem prawdy.

### 2. Ustaw rekordy DNS w home.pl

1. Zaloguj się na https://panel.home.pl → **Domeny** → wybierz domenę → **Konfiguracja DNS** (lub „Zarządzaj rekordami DNS”).
2. Jeśli domena korzysta z „DNS home.pl” – edytuj rekordy. Jeśli ma ustawione zewnętrzne serwery DNS, przełącz na DNS home.pl albo edytuj rekordy tam, gdzie faktycznie są.
3. Usuń istniejące rekordy **A** i **AAAA** dla domeny głównej (`@`) oraz rekord **A/CNAME** dla `www`
   (domyślnie wskazują na hosting home.pl – zostawienie ich spowoduje losowe wyświetlanie starej strony).
   **Nie usuwaj** rekordów MX/TXT od poczty, jeśli klient ma pocztę w home.pl.
4. Dodaj rekordy:

   | Typ   | Nazwa / host | Wartość                | TTL  |
   |-------|--------------|------------------------|------|
   | A     | `@`          | `76.76.21.21`          | 3600 |
   | CNAME | `www`        | `cname.vercel-dns.com` | 3600 |

   W home.pl pole „nazwa” dla domeny głównej bywa puste lub `@`; dla `www` wpisz samo `www` (panel dokleja domenę).
5. Zapisz. Propagacja trwa zwykle od kilku minut do kilku godzin (maks. 24–48 h).

### 3. Sprawdź i dokończ

1. W Vercelu na liście domen status zmieni się z „Invalid Configuration” na **Valid Configuration**; certyfikat SSL (Let’s Encrypt) Vercel wystawia automatycznie – nic nie trzeba kupować w home.pl.
2. Sprawdź propagację: `nslookup michalmelan.pl` powinno zwrócić `76.76.21.21`, `nslookup www.michalmelan.pl` → `cname.vercel-dns.com`.
3. Dodaj domenę do CORS w Sanity (patrz sekcja CORS wyżej): `https://michalmelan.pl` i `https://www.michalmelan.pl`, z „Allow credentials” – inaczej `/studio` na produkcji nie pozwoli się zalogować.

### Uwagi

- Hosting WWW w home.pl staje się niepotrzebny – można go nie przedłużać, ale **domenę i pocztę** trzeba przedłużać nadal.
- Jeśli home.pl ma włączone „Przekierowanie domeny” lub „Parkowanie” – wyłącz, bo nadpisuje rekordy DNS.
- Alternatywa (mniej zalecana dla pierwszego wdrożenia): przenieść całą obsługę DNS do Vercela, ustawiając w home.pl serwery nazw `ns1.vercel-dns.com` i `ns2.vercel-dns.com`. Wtedy rekordy poczty (MX) trzeba ręcznie odtworzyć w Vercelu – łatwo o przerwę w działaniu poczty, dlatego preferuj wariant z rekordami A/CNAME.
