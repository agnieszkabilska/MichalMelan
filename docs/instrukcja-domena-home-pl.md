# Jak podpiąć domenę melan.pl do nowej strony – instrukcja krok po kroku

Nowa strona jest już gotowa i działa na serwerach Vercel. Żeby była widoczna pod adresem **melan.pl**,
trzeba w panelu home.pl (tam, gdzie jest zarejestrowana domena) zmienić dwa „drogowskazy” (rekordy DNS),
aby wskazywały na nowy serwer zamiast na stary hosting home.pl.

Zajmie to ok. 10 minut. Poczta e-mail (michal@melan.pl) **nie przestanie działać** – nie ruszamy jej ustawień.

---

## Krok 1. Zaloguj się do home.pl

1. Wejdź na **https://panel.home.pl** i zaloguj się.
2. W menu po lewej kliknij **Domeny**.
3. Na liście kliknij domenę **melan.pl**.
4. Wybierz zakładkę **Konfiguracja DNS** (może się nazywać „Rekordy DNS” lub „Zarządzaj rekordami DNS”).

Zobaczysz tabelę z wierszami – każdy wiersz to jeden rekord. Interesują nas tylko rekordy typu **A**, **AAAA** i **CNAME**.

---

## Krok 2. Usuń stare drogowskazy

Znajdź i **usuń** (ikona kosza / „Usuń”) następujące wiersze – to one kierują dziś na stary hosting:

| Typ | Nazwa (host) | Co zrobić |
|---|---|---|
| A | `melan.pl` albo `@` albo puste pole | usuń |
| AAAA | `melan.pl` albo `@` albo puste pole | usuń (jeśli istnieje) |
| A lub CNAME | `www` albo `www.melan.pl` | usuń |

⚠️ **NIE usuwaj** wierszy typu **MX**, **TXT** ani niczego z „mail”, „poczta”, „smtp”, „imap” w nazwie –
to ustawienia poczty e-mail.

---

## Krok 3. Dodaj dwa nowe drogowskazy

Kliknij **Dodaj rekord** i wpisz dokładnie (najlepiej kopiuj–wklej):

**Rekord nr 1 – adres główny melan.pl**

| Pole | Wartość |
|---|---|
| Typ | **A** |
| Nazwa / host | `@` (jeśli panel nie przyjmuje `@`, zostaw pole puste) |
| Wartość / adres IP | `216.198.79.1` |
| TTL | zostaw domyślne (np. 3600) |

**Rekord nr 2 – adres www.melan.pl**

| Pole | Wartość |
|---|---|
| Typ | **CNAME** |
| Nazwa / host | `www` |
| Wartość / cel | `f60414b1b3c0a8ae.vercel-dns-017.com` |
| TTL | zostaw domyślne (np. 3600) |

Zapisz zmiany.

---

## Krok 4. Sprawdź, czy home.pl nie „przekierowuje” domeny

W ustawieniach domeny w home.pl poszukaj opcji **Przekierowanie domeny** lub **Parkowanie domeny**.
Jeśli któraś jest włączona – **wyłącz ją**, bo nadpisze powyższe ustawienia.

---

## Krok 5. Poczekaj

Zmiany DNS rozchodzą się po internecie od kilku minut do kilku godzin (w skrajnym przypadku do 24 h).
W tym czasie strona może się jeszcze przez chwilę pokazywać stara – to normalne.

Jak poznać, że działa: wejdź na **https://www.melan.pl** – powinna pojawić się nowa strona z zieloną kłódką (certyfikat SSL
wystawia się automatycznie, nie trzeba nic kupować).

---

## Co dalej

- Daj nam znać, gdy zrobisz Krok 3 – sprawdzimy po naszej stronie, czy wszystko się połączyło, i dokończymy konfigurację
  panelu do edycji treści (adres **https://www.melan.pl/studio**).
- Stary hosting WWW w home.pl nie będzie już potrzebny (można go nie przedłużać).
  **Domenę melan.pl i pocztę trzeba przedłużać nadal** – bez domeny strona i e-mail przestaną działać.

## Gdyby coś nie wyszło

Nie da się tym nic trwale zepsuć – w najgorszym razie przez chwilę nie wyświetli się strona. W razie wątpliwości zrób
zrzut ekranu tabeli rekordów DNS (przed i po zmianach) i prześlij go nam – pomożemy.
