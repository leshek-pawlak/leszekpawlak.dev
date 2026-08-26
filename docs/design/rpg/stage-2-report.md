# Etap 2 — fundament RPG i automatyka czasu

Data wykonania: 26.08.2026. Kierunek makiety został zatwierdzony przez użytkownika przed rozpoczęciem integracji.

## Zakres wdrożony

- Wspólny layout Next.js ma teraz malarskie tło tawerny/pracowni, warstwy przyciemnienia i subtelny ruch. Obraz jest statycznie importowany przez `next/image`, otrzymuje responsywny `srcset`, blur placeholder i nie wymaga kopiowania zdjęcia referencyjnego do `public`.
- Trzy zestawy ciemnych tokenów dnia, wieczoru i nocy zastąpiły dawną jasną paletę. Dotychczasowe klasy Tailwind nadal działają, ale korzystają z semantycznych kolorów nowej ramy.
- Sześć prawdziwych tras ma stałe menu RPG na desktopie. Każda pozycja pokazuje metaforyczną nazwę i dotychczasową dosłowną etykietę; aktywna trasa jest oznaczona także przez `aria-current`.
- Poniżej 1100 px menu przechodzi w panel. Ma tło zamykające, pełną listę tras, GitHub i LinkedIn, fokus przenoszony do menu, pętlę Tab/Shift+Tab i powrót fokusu po Escape.
- Przełączniki PL/EN zachowują bieżącą trasę. Oba warianty są stale widoczne.
- Motyw jest ustawiany przed pierwszym wyświetleniem przez skrypt zgodny z przewodnikiem Next.js o zapobieganiu błyskowi przed hydratacją. Po hydratacji aktualizuje się co minutę oraz po powrocie do karty.
- Stopka i baner cookies otrzymały zatwierdzoną oprawę. Klucz `cookie-consent-accepted`, teksty, profile zewnętrzne i zachowanie zgody pozostają bez zmian. Brak dostępu do storage nie blokuje zamknięcia banera.
- Usunięto stare animowane plamy i siatkę z `Hero`, ponieważ zasłaniały zatwierdzone tło. Treść, oba CTA i ich adresy pozostały bez zmian.
- Zewnętrzne fonty Google zostały usunięte z layoutu. Oprawa używa systemowego kroju bezszeryfowego oraz Georgia dla nagłówków, dzięki czemu nie wykonuje żądania fontów przy buildzie lub pierwszym wejściu.

## Zachowane funkcje i dane

Nie zmieniono formularza Web3Forms, jego honeypota, statusów i zmiennej `NEXT_PUBLIC_WEB3FORMS_KEY`; endpoint `/api/contact` również pozostał bez zmian. Test przeglądarkowy zatrzymał się na natywnej walidacji pustych pól i nie wysyłał wiadomości.

Pozostały także:

- 6 tras × 2 locale i detekcja locale dla `/`;
- 23 umiejętności, 4 usługi, 9 wpisów doświadczenia i 6 kroków współpracy;
- bieżąca pozycja zawodowa z datą końcową `null`;
- link i nazwa pobierania `NDA-Leszek-Pawlak-PL-EN.pdf`;
- Analytics, konfiguracja Sanity, proxy next-intl, metadane i favicon;
- prawdziwe linki GitHub/LinkedIn oraz pełne teksty PL/EN, w tym bezpłatna wycena po angielsku.

## Weryfikacja

| Próba             | Wynik                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript        | `tsc --noEmit` — sukces.                                                                                                                                                                     |
| Build produkcyjny | `next build --webpack` — sukces; 12 wersji językowych stron wygenerowanych jako SSG, `/api/contact` pozostał dynamiczny.                                                                     |
| Prettier          | Wszystkie zmienione pliki TS/TSX/CSS zgodne.                                                                                                                                                 |
| Granice czasu     | 8 przypadków: 00:00, 05:59, 06:00, 17:59, 18:00, 21:59, 22:00, 23:59 — sukces.                                                                                                               |
| Trasy i układ     | 33 kombinacje. Wszystkie trasy PL/EN przy 390 i 1440 px oraz reprezentatywne ekrany przy 320, 768 i 1024 px; właściwa aktywna pozycja, nagłówek, tło i brak poziomego przewijania dokumentu. |
| Treści            | W DOM potwierdzono 23/4/9/6 rekordów oraz komplet atrybutów linku NDA.                                                                                                                       |
| Locale            | `/` przekierowuje według detekcji; przełączenie EN → PL na `/contact` prowadzi do `/pl/contact` bez błędu hydratacji.                                                                        |
| Menu mobilne      | Osiem linków, blokada przewijania tła, pętla fokusu w obie strony, zamknięcie Escape i przywrócenie fokusu.                                                                                  |
| Cookies           | Baner widoczny przed zgodą, znika po akceptacji i pozostaje ukryty po odświeżeniu.                                                                                                           |
| Kontakt           | Pusty formularz wskazuje `name`, `email` i `message` jako niepoprawne; nie wykonano prawdziwego wysłania.                                                                                    |
| Konsola           | Po poprawkach świeża karta i przebieg po trasach nie zgłaszają błędów ani ostrzeżeń.                                                                                                         |

`npm run lint` nadal nie startuje: `typescript-eslint` z `eslint-config-next` nie obsługuje zainstalowanego TypeScript 7.0. To wcześniej rozpoznana niezgodność narzędziowa, a nie błąd zgłoszony w zmienionych plikach. Nie instalowano drugiej wersji TypeScript i nie wyłączano reguł. Domyślny build Turbopack w sandboxie wcześniej blokowało tworzenie procesu na porcie; oficjalny wariant Webpack z tej samej wersji Next.js przeszedł w całości.

## Następny etap

Etap 3 przebuduje zawartość ekranów w tej ramie: najpierw `Hero` i „O mnie”, potem usługi, doświadczenie, współpracę i kontakt. Wtedy karta postaci otrzyma zatwierdzony portret maga, a obecne przejściowe karty zostaną zastąpione docelowymi panelami bez zmiany danych.
