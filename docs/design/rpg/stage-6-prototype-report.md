# Etap 6 — „Pracownia kształtów”

Data aktualizacji: 27.08.2026. Status: druga wersja funkcjonalnego prototypu gotowa do odbioru użytkownika.

## Zmiana kierunku

Pierwszy prototyp był piaskownicą z magiem, telekinezą, mrozem, lawą i lokalnie zapisywaną rzeźbą. Po teście użytkownik ocenił go jako dobrą podstawę techniczną, ale niegrywalną. Mechanika maga i zaklęć została świadomie zastąpiona grą logiczną inspirowaną Snipperclips i tangramem.

Gra nadal działa wyłącznie na osobnych trasach `/pl/playground` i `/en/playground`, ma własną pozycję nawigacji i jest ładowana dynamicznie. Strona główna, automatyczne pory, cookies, kontakt, NDA i pozostałe podstrony nie zależą od modułu gry.

Po udanej wysyłce formularza kontaktowego strona wykorzystuje wzorzec wizualny najlepszego wyniku: animowany portal na czarnym półprzezroczystym overlayu oraz tę samą ilustrację dumnego maga. Jest to osobny, lekki komponent kontaktu; nie ładuje logiki gry i nie zmienia kontraktu wysyłki Web3Forms.

## Pętla gry

- Początek rundy losuje jedną ze 100 deterministycznie zbudowanych i ponumerowanych figur. Każda geometria w puli jest unikalna.
- Każdy cel jest zbudowany z 5–8 rozwiązywalnych fragmentów. Każdy fragment ma ścięty narożnik i zajmuje 87,5% pola kwadratu, więc ułożenie wyłącznie nieprzyciętych klocków nie osiągnie wyniku powyżej 90%.
- Podajnik pokazuje zawsze ten sam niebieski kwadrat. Kolejne egzemplarze pojawiają się w prawej strefie planszy; aktywny limit 14 chroni DOM i nadal wielokrotnie przewyższa zapotrzebowanie najtrudniejszego wzoru.
- Klocek można przeciągać, przesuwać strzałkami, precyzyjnie przesuwać z `Shift`, obracać o 15° przez Q/E lub widoczne przyciski, ciąć wielokrotnie i odłożyć.
- „Gotowe” oblicza podobieństwo i otwiera animowany modal z pełnoekranowym, czarnym półprzezroczystym overlayem. Wynikowi odpowiada komunikat oraz jedna z pięciu reakcji Maga TypeScriptu.
- Modal pozwala rozpocząć nową rundę przez „Jeszcze raz” albo wrócić na stronę główną przez „Wystarczy”. Nie można go przypadkowo zamknąć kliknięciem tła; fokus pozostaje pomiędzy dwiema decyzjami.
- „Nowy kształt” czyści planszę i wybiera figurę, która nie pojawiła się wcześniej w bieżącej puli. Po wykorzystaniu wszystkich 100 figur zaczyna się nowa pula bez natychmiastowego powtórzenia ostatniego celu. Bieżąca runda i historia puli trwają podczas zmiany języka lub nawigacji w tej samej karcie; nie są zapisywane w `localStorage`.
- Interfejs pokazuje numer bieżącej figury, ale nie ujawnia liczby celów pozostałych w puli.

## Mechanika cięcia

Klocek jest wypukłym wielokątem w lokalnym układzie 100 × 100. Cięcie wybiera dwa spośród ośmiu punktów obwodu i zachowuje jedną półpłaszczyznę wyznaczonej linii. Implementacja używa algorytmu Sutherlanda–Hodgmana, więc kolejne cięcie działa na wyniku poprzedniego. Odrzucane są operacje tworzące mniej niż trzy wierzchołki, zbyt mały fragment albo praktycznie niezmieniony klocek.

Na telefonie wybrany blok trafia do powiększonego stołu roboczego. Osiem uchwytów ma po 44 × 44 px. Użytkownik dotyka punktu 1 i 2, widzi niebieski podgląd zachowywanego obszaru, może odwrócić stronę, a dopiero potem zatwierdza cięcie. Nie musi prowadzić cienkiej linii palcem po małym elemencie planszy.

Dialog zaczyna fokus na pierwszym uchwycie, zatrzymuje Tab wewnątrz, zamyka się przez Escape lub jawny przycisk i oddaje fokus do „Przytnij”. Wszystkie uchwyty i akcje mają nazwy PL/EN.

## Punktacja

Przy „Gotowe” plansza jest próbkowana siatką co 4 jednostki logicznego świata. Dla sumy wielokątów celu i gracza liczony jest wskaźnik przecięcia nad sumą pól (`intersection over union`). Nadmiarowe elementy i puste miejsca obniżają wynik tak samo.

| Wynik   | Pasmo       | Komunikat PL                                |
| ------- | ----------- | ------------------------------------------- |
| 91–100% | `excellent` | Jesteś naprawdę dobry w te klocki.          |
| 70–90%  | `details`   | Następnym razem zwróć uwagę na szczegóły.   |
| 50–69%  | `effort`    | Chyba niezbyt się przyłożyłeś do tej pracy. |
| 30–49%  | `ignored`   | Zwyczajnie to olałeś.                       |
| 0–29%   | `hopeless`  | Jesteś w tym beznadziejny.                  |

Każde pasmo ma osobną ilustrację w `public/images/rpg/results/`: dumny gest szacunku, spokojna neutralność, rozczarowanie ze skrzyżowanymi rękami, klasyczny facepalm pełen zażenowania oraz odwrócenie z anatomicznie poprawnym gestem zakończenia rozmowy. Grafiki powstały na podstawie portretu użytkownika i zatwierdzonej karty maga, a następnie zostały zapisane jako pięć przezroczystych plików WebP.

## Architektura

- `src/components/rpg/playground/CuttingPlayground.tsx` — stan rundy, zdarzenia Pointer Events, sterowanie klawiaturą, stół cięcia oraz portal z wynikiem i reakcją maga.
- `src/components/rpg/playground/CuttingPlayground.module.css` — plansza 4:3, jednolita sylwetka celu, niebieskie klocki, responsywny panel, stół mobilny i animowany modal wyniku.
- `src/lib/rpg/cuttingGame.ts` — czysta geometria, deterministyczna pula 100 celów, cięcie, transformacje, punktacja i pasma wyniku.
- `tests/cutting-game.test.mjs` — testy modelu bez przeglądarki.

Moduł używa DOM/SVG i React. Nie dodano silnika, fizyki, canvasowej pętli animacji ani nowej zależności. Pięć zoptymalizowanych ilustracji WebP jest renderowanych warunkowo dopiero po ocenie figury, bez dołączania dodatkowego kodu komponentu obrazów. Usunięto nieużywane moduły pierwszej wersji odpowiedzialne za losowe materiały, rzeźbę i `localStorage`.

## Weryfikacja bieżąca

| Próba                | Wynik                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testy jednostkowe    | `npm test` — 10/10: formularz, motyw czasu, 100 unikalnych celów, pełna pula bez powtórek, wielokrotne cięcie, granice, punktacja i progi.                                                           |
| TypeScript i format  | `tsc --noEmit`, Prettier oraz `git diff --check` — sukces.                                                                                                                                           |
| Build produkcyjny    | `npm run build -- --webpack` — sukces; 14 lokalizowanych stron SSG, `/api/contact` pozostał dynamiczny.                                                                                              |
| Regresja tras        | 70 kombinacji: 5 szerokości × 7 tras × PL/EN; bez błędów struktury, canonicali, obrazów i overflow.                                                                                                  |
| Scena                | 10 kombinacji: 5 szerokości × PL/EN; jedna plansza 4:3, jeden podajnik, 5–8 fragmentów celu i brak opóźnionego placeholdera.                                                                         |
| Pula figur           | 100 kolejnych losowań w przeglądarce dało 100 różnych identyfikatorów; następne losowanie rozpoczęło nową pulę bez natychmiastowej powtórki.                                                         |
| Podajnik i cięcie    | Osiem pierwszych klocków ma osobne miejsca startowe. Po dobraniu drugiego ponownie wybrano pierwszy i wykonano na nim kolejne cięcie; geometria się zmieniła, a aktywny klocek pozostał na wierzchu. |
| Telefon 390 × 844 px | Plansza ma proporcję 4:3, dokument nie ma poziomego overflow, osiem uchwytów ma 44 px i stół mieści wszystkie główne akcje.                                                                          |
| Fokus                | Stół zaczyna na uchwycie 1; anulowanie przywraca fokus do „Przytnij”.                                                                                                                                |
| Przeciąganie i wynik | Gest wielopunktowy przeniósł klocek; „Gotowe” policzyło wynik i pokazało komunikat właściwego pasma.                                                                                                 |
| Modal wyniku         | Pełnoekranowy overlay ma poprawne granice 1280 × 720 i 390 × 844 px; reakcja maga, wynik oraz obie decyzje są widoczne bez poziomego overflow.                                                       |
| Decyzje po wyniku    | „Jeszcze raz” wyczyściło planszę i wylosowało nieużyty cel; „Wystarczy” przeszło do lokalizowanej strony głównej.                                                                                    |
| Fokus wyniku         | Po otwarciu fokus trafia na „Jeszcze raz”; Tab przechodzi do „Wystarczy” i wraca do pierwszej akcji. `prefers-reduced-motion` wyłącza animację wejścia.                                              |
| Sylwetka             | Cel renderuje się jako jeden półprzezroczysty obszar, bez linii zdradzających podział na rozwiązujące go klocki.                                                                                     |
| Sesja                | PL→EN oraz podstrona→Wstecz zachowują cel i geometrię klocków; pełne odświeżenie zaczyna pustą rundę.                                                                                                |
| Nagłówek             | Widoczny opis bieżącej pory został usunięty; `data-time` nadal zmienia się automatycznie i steruje paletą strony.                                                                                    |

## Koszt ładowania

| Zasób gry               | Rozmiar gzip |
| ----------------------- | -----------: |
| Wejście trasy           |      1 406 B |
| Dynamiczna logika React |      5 662 B |
| CSS gry                 |      4 221 B |
| **Razem kod pracowni**  | **11 289 B** |

Animowany portal wyniku, obsługa fokusu i pula 100 figur zwiększyły kod drugiego prototypu łącznie o 1 974 B gzip. Cała pracownia pozostaje modułem o rozmiarze około 11,3 KB gzip, a dynamiczne pliki logiki i CSS nadal nie należą do wejścia strony głównej.

Pięć ilustracji reakcji zajmuje łącznie 524 KB w plikach źródłowych WebP. Nie są częścią wejścia strony głównej ani początkowego renderu gry; przeglądarka pobiera wyłącznie ilustrację odpowiadającą pokazanemu wynikowi.

`npm run lint` nadal ma znaną blokadę niezależną od gry: używana wersja `typescript-eslint` nie obsługuje TypeScript 7 i zatrzymuje się przed analizą plików.

Nie wykonano commita, pushowania ani publikacji.
