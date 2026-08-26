# Etap 3 — migracja ekranów i treści

Data odbioru: 27.08.2026. Użytkownik zaakceptował wygląd i zatwierdził zmiany na gałęzi głównej.

## Zakres wdrożony

- Ekran główny stał się kartą postaci: zachowuje zawodowy tytuł, opis, „12+ lat”, oba dotychczasowe CTA i dodaje zaakceptowany portret Leszka jako maga.
- „O mnie” ma formę dossier z pełną biografią i czterema grupami obejmującymi wszystkie 23 umiejętności.
- Cztery usługi są księgą zaklęć. Nazwy i opisy pozostają dosłowne, a metafora jest wyłącznie warstwą interfejsu.
- Dziewięć rekordów doświadczenia tworzy dziennik wypraw. Zachowano firmy, role, daty, pełne opisy i technologie, w tym bieżący wpis Fungies.io.
- Sześć kroków współpracy tworzy wspólny quest; sekcja NDA nadal udostępnia ten sam dokument pod tą samą nazwą pobierania.
- Kontakt ma układ wiadomości do maga i panel wsparcia dla drużyny. `handleSubmit`, Web3Forms, honeypot, wymagane pola, stany wysyłki i kontrakt danych nie zostały zmienione.
- Nowe etykiety interfejsu dodano równolegle w PL i EN. W angielskiej karcie pozostaje „Get a free estimate” i informacja o bezpłatnej wycenie.

## Weryfikacja przed odbiorem

| Próba              | Wynik                                                                                                                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript         | `tsc --noEmit` — sukces.                                                                                                                                                                                        |
| Format i różnice   | Prettier, poprawność JSON i `git diff --check` — sukces.                                                                                                                                                        |
| Trasy i szerokości | 36 kombinacji: 6 tras × PL/EN przy 390, 768 i 1280 px oraz dodatkowe 12 prób przy 320 px. Każda strona miała jedno `h1`, prawidłową aktywną pozycję, załadowane obrazy i szerokość dokumentu równą viewportowi. |
| Komplet treści     | W DOM potwierdzono 23 umiejętności, 4 usługi, 9 wpisów doświadczenia i 6 kroków współpracy we wszystkich sprawdzanych locale i szerokościach.                                                                   |
| Kontakt            | Potwierdzono trzy wymagane pola, cztery usługi w panelu wsparcia oraz link i nazwę pobrania NDA. Puste wysłanie ustawiło fokus na polu imienia i nie uruchomiło wysyłki.                                        |
| Nawigacja mobilna  | Osiem linków, blokada przewijania tła, zamknięcie Escape i powrót fokusu do przycisku.                                                                                                                          |
| Locale             | Zmiana EN → PL zachowała trasę `/contact`.                                                                                                                                                                      |
| Motyw              | Ekrany korzystają wyłącznie ze wspólnych semantycznych tokenów dnia, wieczoru i nocy zweryfikowanych w etapie 2; logika czasu nie została zmieniona.                                                            |

Build produkcyjny i pełna kontrola zasobów są częścią etapu 4/5. Test formularza nie wysłał prawdziwej wiadomości.
