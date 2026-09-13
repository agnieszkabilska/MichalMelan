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

## Wdrożenie na Vercel

- Framework: Nuxt (wykrywany automatycznie), build `npm run build`, brak wymaganych zmiennych środowiskowych.
- Opcjonalne nadpisania: `NUXT_PUBLIC_SANITY_PROJECT_ID`, `NUXT_PUBLIC_SANITY_DATASET`.
- Po pierwszym deployu dodaj domenę do CORS (patrz wyżej).

## Skrypty

| Skrypt | Opis |
|---|---|
| `npm run dev` | serwer deweloperski |
| `npm run build` | build produkcyjny (to samo uruchamia Vercel) |
| `npm run seed` | jednorazowe zasilenie Sanity treścią |
| `npm run sanity -- <cmd>` | Sanity CLI w kontekście `studio/` (np. `manage`, `cors list`, `dataset export`) |
