# Etap 4 — ilustracje i dopracowanie

Data wykonania: 27.08.2026.

## Zasoby graficzne

Oryginalne pliki PNG pozostają w `docs/design/rpg/` jako źródła projektowe. Aplikacja korzysta teraz z eksportów w `public/images/rpg/`, generowanych przez `scripts/optimize-rpg-assets.mjs`. Skrypt zapisuje również wymiary i małe placeholdery blur w manifeście, dzięki czemu `next/image` może rezerwować proporcje przed załadowaniem i wybierać wariant dopasowany do szerokości ekranu.

| Zasób                |    PNG źródłowy | WebP aplikacji | Redukcja |
| -------------------- | --------------: | -------------: | -------: |
| Tło tawerny/pracowni |     1 862 323 B |       94 146 B |      95% |
| Portret Leszka       |     2 253 612 B |      154 624 B |      93% |
| Kamień runiczny      |     1 353 640 B |       22 584 B |      98% |
| **Razem**            | **5 469 575 B** |  **271 354 B** |  **95%** |

Pierwszy ekran używa źródeł o łącznej wadze 248 770 B, przed dalszym doborem rozmiaru przez `next/image`, więc mieści się w roboczym budżecie 500 kB. W przeglądarce potwierdzono adresy optymalizatora Next dla tła, portretu i kamienia oraz brak odwołań do źródłowych PNG. Tło ma własny kolor bazowy, rama portretu zachowuje miejsce, a portret otrzymał lokalizowany tekst alternatywny; grafiki wyłącznie dekoracyjne mają pusty `alt`.

Favicon SVG i generowany z niego wariant ICO przedstawiają ten sam ciemny herb LP ze złotą ramą i turkusowym kamieniem. Nie dodano zewnętrznego fontu: zaakceptowany zestaw Georgia + font systemowy nie wykonuje dodatkowych żądań i nie powoduje przesunięcia tekstu.

## Ruch, dostępność i porządkowanie

- Każdy komponent korzystający z `motion` sprawdza `useReducedMotion`. Przy ograniczonym ruchu ważna treść renderuje się od razu bez początkowych przesunięć, rozmycia i zanikania.
- Reguła `prefers-reduced-motion` wyłącza także dryf tła, drobiny i transformacje hover oraz pozostawia natychmiastowe przewijanie.
- Formularz ma stały region `role="status"`, `aria-live="polite"` i `aria-atomic="true"`; jego logika wysyłki i komunikaty pozostały bez zmian.
- Dodano oddzielny token granic kontrolek we wszystkich trzech motywach. Obliczone kontrasty granicy pola względem powierzchni wynoszą 3,94:1–4,38:1, fokusu względem tła 9,10:1–10,32:1, tekstu pomocniczego względem powierzchni 7,42:1–9,42:1, a tekstu na głównym przycisku co najmniej 9,47:1.
- Po przeszukaniu `src/` usunięto wyłącznie stare, nieużywane klasy gradientów, plam, poświat, przechylanych kart i ich animacje — 177 linii CSS. Klasy nowej ramy oraz wszystkie odwołania komponentów pozostały.

## Weryfikacja

| Próba             | Wynik                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build produkcyjny | `npm run build -- --webpack` — sukces; 12 wariantów tras wygenerowanych jako SSG, `/api/contact` pozostał dynamiczny.                               |
| TypeScript        | `tsc --noEmit` — sukces.                                                                                                                            |
| Format i różnice  | Prettier dla plików obsługiwanych przez formatter, poprawność JSON i `git diff --check` — sukces.                                                   |
| Tłumaczenia       | Rekurencyjna zgodność 85 kluczy PL/EN — sukces.                                                                                                     |
| Trasy             | 24 kombinacje: 6 tras × PL/EN przy 390 i 1280 px. Jedno `h1`, jedna aktywna pozycja, brak poziomego przewijania, błędnych obrazów i źródłowych PNG. |
| Komplet treści    | Potwierdzone wartości 23/4/9/6 oraz trzy pola kontaktu.                                                                                             |
| Formularz i fokus | Puste wysłanie zatrzymała walidacja pól `name`, `email`, `message`; fokus trafił na `name`, miał obrys 3 px, a wysyłka nie wystartowała.            |
| Menu mobilne      | Osiem linków, blokada tła, Escape, zamknięcie panelu i powrót fokusu do przycisku.                                                                  |
| Manifest obrazów  | Wszystkie pliki, wymiary i placeholdery obecne; ponowne uruchomienie generatora dało te same rozmiary.                                              |

`npm run lint` nadal zatrzymuje się przed analizą plików, ponieważ `typescript-eslint` z obecnego `eslint-config-next` nie obsługuje TypeScript 7.0. Jest to ta sama znana niezgodność narzędziowa z etapów 0–3; nie wyłączano reguł ani nie instalowano równoległej wersji TypeScript. Nie wykonano prawdziwej wysyłki Web3Forms.
