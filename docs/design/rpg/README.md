# Makieta RPG — etap 1

Stan: **gotowa do oceny wyglądu, bez integracji ze stroną produkcyjną**. Przygotowana 26.08.2026 na podstawie [planu redesignu](../../plan-redesign-rpg.md).

## Uruchomienie

Z katalogu głównego repozytorium:

```sh
node scripts/preview-rpg.mjs
```

Otwórz [lokalny podgląd](http://127.0.0.1:4173/). Nie wymaga Next.js, instalacji dodatkowych pakietów ani kluczy API. Serwer działa wyłącznie na `127.0.0.1`; kończy pracę po Ctrl+C. Inny port można wybrać przez `RPG_PREVIEW_PORT`.

Przykładowe widoki:

- [Karta postaci, PL, automatyczne światło](http://127.0.0.1:4173/?lang=pl&screen=character&theme=auto&width=responsive&cookies=1).
- [Kontakt, EN, noc](http://127.0.0.1:4173/?lang=en&screen=contact&theme=night&width=responsive&cookies=1).
- [Kontakt, PL, dzień, ramka telefonu](http://127.0.0.1:4173/?lang=pl&screen=contact&theme=day&width=mobile&cookies=1).

Parametry adresu zapisują tylko ustawienia podglądu, nigdy treść formularza. Otwarcie samego HTML z dysku nie jest pełnym podglądem: użyj serwera, zwłaszcza do pobrania NDA.

## Co można ocenić

| Element       | Zakres makiety                                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Karta postaci | Portret Leszka jako maga w ramie, zawód i prawdziwy opis doświadczenia, CTA kontaktowe, podgląd czterech usług.                                                                                                                       |
| Menu          | Sześć widocznych pozycji na desktopie; rozwijane menu na mniejszych ekranach, aktywna pozycja, GitHub i LinkedIn także na telefonie. Historia, doświadczenie i współpraca są oznaczonymi pozycjami poglądowymi, bez osobnych ekranów. |
| Kontakt       | Pola z etykietami, natywna walidacja, podgląd gotowości/wysyłania/sukcesu/błędu, istniejący PDF NDA.                                                                                                                                  |
| Języki        | PL/EN dla obu ekranów, usług, komunikatów, alternatywnego tekstu portretu i kontrolek; zmiana języka zachowuje ekran i wpisane dane. EN zachowuje informację o bezpłatnej wycenie.                                                    |
| Pora          | Automatycznie według lokalnej godziny: dzień 06:00–17:59, wieczór 18:00–21:59, noc 22:00–05:59. Aktualizacja co minutę oraz po powrocie do karty. Przełącznik ręczny służy ocenie makiety.                                            |
| Ruch          | Powolny ruch tła i drobne cząsteczki CSS. Przycisk pauzy; obsługa `prefers-reduced-motion` i pauza w ukrytej karcie.                                                                                                                  |
| Telefon       | Układ reaguje na faktyczną szerokość oraz na przycisk „Telefon” ograniczający scenę do 390 px.                                                                                                                                        |
| Cookies       | Podgląd banera i jego zamknięcia. Nie zapisuje rzeczywistej zgody.                                                                                                                                                                    |

**Formularz nie wysyła wiadomości.** Przycisk symuluje odpowiedź po 900 ms: standardowo sukces z wyczyszczeniem pól; po wybraniu „Błąd” — błąd zachowujący dane. Wybór „Wysyłanie” pokazuje zablokowany przycisk do czasu zmiany stanu kontrolką. Makieta nie testuje Web3Forms, honeypota, limitowania ani endpointu `/api/contact`.

Nie ma tu analityki, Sanity, routingu Next.js ani zapisu do `localStorage`/`sessionStorage`. To celowo odizolowany wzorzec wyglądu. Wszystkie dotychczasowe komponenty, trasy, integracje, konfiguracja, tłumaczenia i dokumenty produkcyjne pozostają niezmienione. Serwer udostępnia wyłącznie listę plików makiety i istniejące NDA; polityka CSP blokuje połączenia skryptów oraz wysyłanie formularzy.

## Proponowana oprawa

Pełne menu i spokojnie poruszające się tło nawiązują do wskazanej roli Witchera 3. Malarska pracownia, turkus szaty i ciepłe obramowania rozwijają kierunek inspirowany Bastionem. Minigra w duchu Trine pozostaje osobnym etapem 6.

| Token        | Dzień     | Wieczór   | Noc       |
| ------------ | --------- | --------- | --------- |
| Tło bazowe   | `#18282c` | `#201d2b` | `#0d1623` |
| Panel        | `#243638` | `#312935` | `#172437` |
| Główny tekst | `#fbf0df` | `#fff0df` | `#edf1f8` |
| Złoto        | `#e3bc78` | `#edb87a` | `#d5c291` |
| Akcent/fokus | `#abd8c4` | `#cfb7e7` | `#9fc8eb` |

Wszystkie pory pozostają ciemne; dzień ma jaśniejsze światło, zielonkawe panele i bardziej nasycone tło. Wieczór jest cieplejszy, noc chłodna i granatowa. Nagłówki oraz menu używają Georgia, treść systemowego kroju bezszeryfowego (z Geist na początku listy fallbacków). Makieta nie pobiera fontów. Docelowy krój nagłówków i sposób jego lokalnego dostarczania ustalimy przy wdrożeniu.

Portret i kamień są **nieprzezroczystymi obrazami w ramkach**, nie wyciętymi sprite'ami. Użyto zatwierdzonych PNG bez ponownego generowania ani kopiowania zdjęcia referencyjnego. Źródła mają łącznie ok. 5,47 MB; optymalizacja rozmiarów i formatów należy do integracji, nie została tu wykonana. Szczegóły grafik: [rpg-assets.md](../../rpg-assets.md).

## Weryfikacja wykonana 26.08.2026

| Próba                                                                     | Wynik                                                                                                                                                                                                           |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Przeglądarka: karta i kontakt, PL/EN, szerokości 320/390/768/1024/1440 px | 20 kombinacji; brak poziomego przewijania dokumentu i elementów treści wychodzących poza scenę.                                                                                                                 |
| Oględziny makiety w przeglądarce                                          | Obejrzano kartę, menu mobilne i formularz oraz warianty oświetlenia. To nie jest jeszcze odbiór wizualny przez użytkownika.                                                                                     |
| Formularz                                                                 | Puste pola i błędny email blokują symulację; wysyłanie blokuje przycisk; sukces czyści pola; błąd zachowuje dane. Przełączenie PL/EN zachowuje wpisaną treść.                                                   |
| Nawigacja i baner                                                         | Menu otwiera się i zamyka; Escape w menu przywraca fokus przełącznikowi; przejście do ekranu ustawia fokus nagłówka. Dialog pokazuje cztery usługi i kieruje do kontaktu. Baner można ukryć i ponownie pokazać. |
| Animacje                                                                  | Sprawdzono ręczne zatrzymanie tła w przeglądarce. Obsługę systemowego ograniczenia ruchu sprawdzono w kodzie/CSS, bez zmiany ustawienia systemowego w teście.                                                   |
| Czas i słowniki                                                           | Sprawdzono 8 wartości na granicach pór, zgodność 91 kluczy PL/EN, tłumaczenia użyte w HTML, unikalność ID oraz odwołania do ikon.                                                                               |
| Zasoby i serwer                                                           | 7 dozwolonych zasobów odpowiada 200; NDA ma typ `application/pdf` i nagłówek PDF. Pięć prób dostępu do niedozwolonych/nieistniejących ścieżek zwraca 404; POST zwraca 405.                                      |
| Składnia JS                                                               | `node --check docs/design/rpg/prototype.js` i `node --check scripts/preview-rpg.mjs` zakończone poprawnie.                                                                                                      |
| Konsola makiety                                                           | Brak ostrzeżeń i błędów w sprawdzonym przebiegu.                                                                                                                                                                |

Weryfikacja **istniejącej aplikacji**, oddzielona od makiety:

- `npm run lint` nie przeszedł: zainstalowany `typescript-eslint` zgłasza brak obsługi TypeScript 7. Nie zmieniono zależności ani konfiguracji linta.
- `npm run build` przeszedł `tsc --noEmit`, ale nie zakończył kompilacji Next.js. Pierwszą próbę blokowało pobranie fontów Google, kolejne zatrzymały się w Turbopack przy tworzeniu procesu i wiązaniu portu (`Operation not permitted`), także po żądaniu uruchomienia poza sandboxem.
- Nie wykonano pełnej regresji istniejących tras ani rzeczywistej wysyłki maila. Pomyślne sprawdzenie makiety nie zastępuje tych testów przed integracją i publikacją.

## Kolejny krok

Potrzebna jest ocena palet, typografii, kadrowania portretu, ramek, etykiet i czytelności formularza. Po zatwierdzeniu wzorca można przejść do etapu 2: przenieść tokeny i wspólną ramę do Next.js, zachowując wszystkie trasy i funkcje. Nie kopiować testowego formularza, kontrolek podglądu ani zastępczego banera do działającej strony.
