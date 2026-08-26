# Etap 5 — regresja i odbiór

Data wykonania: 27.08.2026.

## Zakres zmian

Etap zamyka redesign kontrolą regresji i przygotowuje go do decyzji o publikacji. Nie wykonano wdrożenia, commita ani rzeczywistej wysyłki formularza.

Każda z sześciu stron otrzymała osobny tytuł i opis w PL/EN. Wspólny generator metadanych dodaje również canonical, alternatywne adresy `pl`, `en` i `x-default`, Open Graph oraz Twitter Card. Bazowy adres pozostaje zgodny z istniejącą konfiguracją aplikacji: `https://leszekpawlak.vercel.app`; jego ewentualna zmiana wymaga wskazania docelowej domeny.

Dodano lekki zestaw testów oparty na wbudowanym runnerze Node, bez nowego frameworka testowego. Żeby testować zachowanie bez wysyłania wiadomości, logikę obu istniejących ścieżek kontaktowych wydzielono do funkcji z możliwością podania atrap `fetch`. Formularz nadal wysyła bezpośrednio do Web3Forms przez `NEXT_PUBLIC_WEB3FORMS_KEY`, a `/api/contact` pozostaje oddzielnym endpointem z `WEB3FORMS_ACCESS_KEY`, honeypotem, walidacją i limitem trzech prób na minutę.

## Automatyczne testy

| Próba          | Wynik                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Motyw czasu    | 8 przypadków obejmujących noc, dzień, wieczór i wszystkie granice 06:00, 18:00 oraz 22:00 — sukces.                        |
| Formularz w UI | Kontrakt URL, metoda, klucz, pola i temat; odpowiedź dostawcy oraz awaria sieci — sukces z atrapami.                       |
| `/api/contact` | Brak pól, błędny email, honeypot, brak konfiguracji, sukces i błąd dostawcy oraz czwarta próba limitu — sukces z atrapami. |
| Cały zestaw    | `npm test` — 4 testy, 4 zaliczone, 0 błędów.                                                                               |

Testy nie korzystają z prawdziwych kluczy i nie wysyłają wiadomości do Web3Forms.

## Macierz przeglądarkowa

Na produkcyjnym buildzie sprawdzono 60 kombinacji: pięć szerokości `320`, `390`, `768`, `1024`, `1440` px × sześć tras × PL/EN. Po ostatniej refaktoryzacji formularza powtórzono 24 kombinacje dla `390` i `1440` px.

W każdej próbie potwierdzono właściwy adres i język dokumentu, pojedynczy `h1`, pojedynczą aktywną pozycję nawigacji, brak poziomego przewijania, brak uszkodzonych obrazów i brak odwołań do źródłowych PNG. Tytuł, opis, canonical i alternatywne wersje językowe odpowiadały trasie. Liczby treści pozostały bez zmian: 23 umiejętności, 4 usługi, 9 wpisów doświadczenia i 6 etapów współpracy.

Dodatkowo potwierdzono:

- Wstecz/Dalej oraz zmianę EN → PL bez utraty podstrony;
- przekierowanie z `/` według locale przeglądarki;
- baner cookies przy pierwszym wejściu oraz trwałość akceptacji po odświeżeniu i zmianie języka;
- natywną walidację błędnego emaila bez rozpoczęcia wysyłki;
- link NDA, nazwę pobieranego pliku i odpowiedź PDF `200`, `application/pdf`, 171 703 B;
- bezpieczne linki GitHub/LinkedIn, skip link, favicon i obecność skryptu Vercel Analytics;
- zachowanie konfiguracji Sanity oraz trzech wariantów motywu.

Ścieżki `prefers-reduced-motion` potwierdzono w kodzie i w etapie 4. W etapie 5 nie wykonano osobnych zrzutów wszystkich tras we wszystkich trzech porach; granice wyboru motywu są pokryte testem jednostkowym, a palety i zachowanie runtime sprawdzono wcześniej.

## Build, jakość i wydajność

| Próba        | Wynik                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Produkcja    | `npm run build -- --webpack` — sukces; 12 lokalizowanych stron jako SSG, `/api/contact` jako trasa dynamiczna.                                                                        |
| TypeScript   | `tsc --noEmit` — sukces.                                                                                                                                                              |
| Format zmian | Prettier dla wszystkich plików etapu 5 oraz `git diff --check` — sukces. Pełne sprawdzenie repo wskazuje wyłącznie starszy, niezmieniany `docs/rpg-assets.md`.                        |
| Tłumaczenia  | 97 odpowiadających sobie kluczy PL/EN — sukces.                                                                                                                                       |
| ESLint       | Uruchomiony, lecz zatrzymany przed analizą plików: `typescript-eslint` z bieżącego `eslint-config-next` nie obsługuje TypeScript 7.0. Nie obniżano TypeScriptu i nie wyłączano reguł. |

Pomiar pierwszej strony PL w produkcyjnym buildzie, przy nagłówku `Accept` odpowiadającym przeglądarce:

| Zasób                                          |                     Transfer |
| ---------------------------------------------- | ---------------------------: |
| HTML po gzip                                   |                      8 777 B |
| 11 plików JS po gzip                           |                    239 388 B |
| CSS po gzip                                    |                      9 206 B |
| Tło i portret dobrane przez optymalizator Next |                    109 618 B |
| **Przybliżony pierwszy ekran**                 | **366 989 B, około 358 KiB** |

Wartość nie obejmuje nagłówków HTTP ani późniejszego żądania Analytics. Przed redesignem nie zapisano równoważnego pomiaru produkcyjnego, dlatego jest to nowy punkt bazowy, a nie deklaracja dokładnej poprawy wobec starej strony. Osobny, porównywalny pomiar zasobów źródłowych z etapu 4 wykazał redukcję przygotowanych ilustracji PNG → WebP o 95%.

## Stan odbioru

Użytkownik potwierdził zakończenie etapu 5 dnia 27.08.2026. Po głównej macierzy poprawiono jeszcze numerację dziennika wypraw: wpisy nadal są wyświetlane od najnowszego, lecz numery opisują chronologię kariery od pierwszego miejsca pracy. Kontrola PL/EN, testy, typy, format i ponowny build produkcyjny przeszły.

Wszystkie funkcje wymagane przez redesign pozostają dostępne. Nie wykonano publikacji — nadal wymaga ona osobnej zgody. Etap 6, czyli minigra „Pracownia maga”, pozostaje odseparowany od odebranego redesignu.
