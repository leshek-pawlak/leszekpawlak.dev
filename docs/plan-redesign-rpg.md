# Plan redesignu: Leszek Pawlak jako postać do zrekrutowania

Data analizy i aktualizacji: 26.08.2026. Status: plan zaakceptowany kierunkowo przez użytkownika, uzupełniony o referencję portretu, inspiracje Witcher 3 / Bastion / Trine i końcowy etap minigry. Kod strony nie został jeszcze przebudowany.

## 1. Cel i granice zmian

Strona ma przypominać menu RPG, w którym odwiedzający poznaje grywalną postać — Leszka — i może zaprosić go do zespołu, aby wspólnie rozwiązać wyzwania techniczne. Główna metafora: doświadczony mag, którego można zrekrutować w tawernie. Rzeczywista oferta konsultingowa musi być równie zrozumiała jak obecnie.

**Warunek nadrzędny: nie rezygnujemy z żadnej zaimplementowanej funkcjonalności.** Zmieniamy układ, oprawę i sposób przedstawienia treści. Zachowujemy wszystkie podstrony, informacje, integracje oraz ścieżki kontaktu. Redesign obejmuje całą stronę, nie tylko ekran główny.

Dotyczy to również automatycznej zmiany wyglądu według lokalnego czasu odwiedzającego. W repozytorium są **trzy**, a nie dwa warianty: dzień, wieczór i noc. Wszystkie pozostają. Każdy otrzyma ciemniejszą paletę, lecz różnice między porami nadal muszą być zauważalne.

Etapy 0–5 dotyczą kompletnego redesignu strony. Dopiero po ich dopięciu realizujemy **etap 6: opcjonalną minigrę z magiem, budowaniem rzeźby i zapisem lokalnym**. Nie dodajemy kont użytkowników, płatności, systemu odblokowywania treści ani zmiany modelu współpracy. Motyw rekrutacji nie oznacza zakupu usługi jednym kliknięciem: główne CTA nadal prowadzi do rozmowy i wyceny.

## 2. Co wynika z analizy repozytorium

### Architektura i obecny wygląd

| Obszar         | Stan w kodzie                                                                                                                                                 | Znaczenie dla redesignu                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stos           | Next.js App Router, React, TypeScript, Tailwind CSS 4, `motion`, `next-intl`                                                                                  | Wystarczy do redesignu. Ewentualną technologię minigry dobieramy dopiero w etapie 6; strona i menu nie będą renderowane w silniku gry.           |
| Routing        | Sześć stron w `src/app/[locale]/`: główna, about, services, experience, workflow, contact                                                                     | Menu RPG powinno korzystać z tych samych adresów i prawdziwych linków.                                                                           |
| Wspólny layout | `src/app/[locale]/layout.tsx`: język, fonty, inicjalizacja motywu, nawigacja, stopka, cookies, Analytics                                                      | To miejsce na wspólną ramę interfejsu. Nie należy odtwarzać integracji oddzielnie na każdej stronie.                                             |
| Styl           | `src/app/globals.css`: tokeny kolorów, jasny dzień i wieczór, granatowa noc, gradienty, animowane plamy, poświaty                                             | Sama zmiana kolorów nie wystarczy. Należy zmienić również kompozycję, obramowania, typografię, ikony i zachowanie dekoracji.                     |
| Komponenty     | Osobne komponenty sekcji; wszystkie obecnie klienckie; powtarzane nagłówki, karty, odstępy i animacje                                                         | Warto wprowadzić kilka wspólnych elementów UI, bez przepisywania całej architektury.                                                             |
| Treści         | `src/messages/pl.json`, `src/messages/en.json`; dodatkowo tablice umiejętności i doświadczenia w komponentach                                                 | RPG jest warstwą prezentacji istniejących danych. Nie zakładamy, że treści są już pobierane z CMS.                                               |
| Grafiki        | Pierwotnie brak portretu i ilustracji fantasy. Użytkownik dostarczył portret „ChatGPT Image 30 lip 2026, 12_13_16.png” jako referencję do wygenerowania maga. | Przygotować autorską postać z zachowaniem podobieństwa, tło i dodatkowe dekoracje. Nie publikować automatycznie surowego zdjęcia referencyjnego. |

Obecny język wizualny wynika z dużych, wyśrodkowanych nagłówków, gradientowego tekstu, zaokrąglonych kart i przycisków oraz abstrakcyjnych animowanych teł. Docelowe menu powinno mieć bardziej uporządkowane panele, trwałą nawigację i wyraźną kartę bohatera.

### Zakres weryfikacji tej analizy

Przeczytano kod wszystkich sześciu stron, komponentów, motywów, tłumaczeń, formularza i endpointu kontaktowego, konfiguracji i schematów Sanity. Sprawdzono obecność plików NDA oraz odnośnik pobierania; nie oceniano treści prawnej ani wyglądu PDF.

Przed formułowaniem zaleceń architektonicznych przeczytano lokalne przewodniki Next.js dotyczące layoutów, komponentów serwerowych/klienckich i motywu przed hydratacją, zgodnie z `AGENTS.md`.

**Pierwsza analiza nie obejmowała udanego przeglądu w przeglądarce.** Wnioski o wyglądzie pochodziły z kodu CSS/JSX. Poniższe problemy dotyczą tamtej próby, przed uzupełnieniem zależności:

- `npm run lint` kończy się błędem `Cannot read properties of undefined (reading 'Cjs')` w `@typescript-eslint/typescript-estree`, przed właściwą oceną kodu.
- `package.json` i lockfile wskazują Next.js `16.2.12`, natomiast lokalny serwer wystartował jako `16.2.10`; początkowy lint używał ESLint `10.6.0`, a lockfile wskazuje `10.8.0`. Lokalne zależności nie były zsynchronizowane z lockfile.
- `npm run dev` uruchomił automatyczną instalację TypeScript i zakończył się błędem Turbopack dotyczącym rozwiązywania pakietu Next.js. Instalację zatrzymano, a pakiety przeniesione przez nią do katalogów tymczasowych przywrócono. Kod, `package.json` i lockfile nie zostały zmienione.
- `npm run build` nie był uruchamiany. Brak podstaw do stwierdzenia, że build przechodzi albo że wykryte problemy dotyczą produkcji.
- Nie znaleziono repozytoryjnego zestawu testów ani skryptu `test`. Nie wysyłano wiadomości do Web3Forms i nie weryfikowano dostarczenia maila ani zdarzeń analitycznych.

**Aktualizacja od użytkownika:** środowisko dev działa poprawnie po zainstalowaniu wszystkich pakietów. Nie traktujemy wcześniejszego uruchomienia jako otwartej blokady ani podstawy do naprawiania konfiguracji. Przed implementacją wystarczy standardowa kontrola zainstalowanych zależności, podglądu, lintowania i buildu. Potwierdzenie działania dev nie jest automatycznie wynikiem testu lint/build; te polecenia wymagają osobnego sprawdzenia. Nie wyłączać kontroli typów ani lintowania.

## 3. Lista funkcjonalności, które muszą pozostać

Poniższa tabela jest listą kontrolną regresji, a nie deklaracją przeprowadzonych testów runtime.

| Funkcja / zawartość            | Gdzie jest zaimplementowana                                     | Warunek zachowania                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sześć podstron i nawigacja     | `src/app/[locale]/`, `src/components/Navigation.tsx`            | Wszystkie dotychczasowe adresy działają; aktywna pozycja menu jest widoczna; działają odświeżenie, link bezpośredni oraz Wstecz/Dalej.               |
| PL/EN i wykrywanie języka      | `src/i18n/`, `src/proxy.ts`, oba pliki wiadomości               | Zachować dwa języki, `localeDetection: true`, domyślny EN i przełączanie języka na odpowiadającej podstronie.                                        |
| Menu mobilne                   | `Navigation.tsx`                                                | Wszystkie pozycje i przełącznik języka pozostają dostępne; po wybraniu linku menu się zamyka.                                                        |
| Automatyczny motyw             | `TimeTheme.tsx`, layout, `globals.css`                          | Zachować lokalny czas, trzy warianty i ustawienie właściwego motywu przed pierwszym wyświetleniem treści.                                            |
| Oferta na stronie głównej      | `Hero.tsx`, namespace `hero`                                    | Nazwisko, rzeczywista specjalizacja, opis korzyści, CTA do kontaktu/wyceny oraz CTA do usług nadal dostępne.                                         |
| Biografia i umiejętności       | `AboutSection.tsx`, namespace `about`                           | Zachować pełną biografię i wszystkie 23 pozycje w czterech kategoriach.                                                                              |
| Cztery usługi                  | `ServicesSection.tsx`, namespace `services`                     | Zachować konsulting architektoniczny, wyceny i planowanie, Code Review & Mentoring oraz strategię integracji AI.                                     |
| Osiem pozycji doświadczenia    | `ExperienceSection.tsx`                                         | Zachować firmy, role, pełne opisy PL/EN, technologie, daty, lokalne formatowanie i oznaczenie „Obecnie”.                                             |
| Sześć etapów współpracy        | `WorkflowTimeline.tsx`, namespace `workflow`                    | Zachować zapytanie, NDA, zakres, akceptację wyceny, dostarczenie/omówienie wyników i zakończenie współpracy.                                         |
| Pobieranie NDA                 | `WorkflowTimeline.tsx`, `public/nda-leszek-pawlak.pdf`          | Zachować adres PDF, atrybut `download` i nazwę `NDA-Leszek-Pawlak-PL-EN.pdf`; przycisk dostępny w PL i EN.                                           |
| Źródło NDA i generator         | `public/nda-leszek-pawlak.html`, `scripts/generate-nda-pdf.mjs` | Nie usuwać i nie przepisywać dokumentu w ramach oprawy RPG. Generator jest osobnym narzędziem wymagającym Puppeteera.                                |
| Formularz kontaktowy           | `ContactSection.tsx`                                            | Zachować imię i nazwisko, email, wiadomość, wymagane pola, typ email, honeypot, stan wysyłania, blokadę przycisku, sukces, błąd i reset po sukcesie. |
| Połączenie z Web3Forms         | `ContactSection.tsx`                                            | Zachować działający kontrakt wysyłki i konfigurację klucza; wygląd przycisku nie może zmienić sposobu dostarczania wiadomości.                       |
| Istniejący endpoint kontaktowy | `src/app/api/contact/route.ts`                                  | Nie usuwać ani nie osłabiać walidacji, honeypota, obsługi odpowiedzi i obecnego ograniczenia liczby zapytań.                                         |
| Baner cookies                  | `CookieBanner.tsx`                                              | Zachować teksty PL/EN, zamknięcie i zapamiętywanie akceptacji pod kluczem `cookie-consent-accepted`.                                                 |
| Analityka                      | `<Analytics />` w layoucie                                      | Zachować montowanie integracji Vercel Analytics; nie przenosić jej do elementu, który znika przy zmianie panelu.                                     |
| Stopka                         | `Footer.tsx`                                                    | Zachować rok, prawa autorskie, GitHub i LinkedIn oraz bezpieczne otwieranie linków zewnętrznych.                                                     |
| Metadane i tożsamość           | layout, `public/favicon.svg`, `src/app/favicon.ico`             | Zachować nazwisko, opis zawodowy, tytuły i Open Graph; zapewnić spójność favicon z nową oprawą.                                                      |
| Animacje i responsywność       | `motion`, `globals.css`, komponenty                             | Zachować animowane wejścia i reakcje na interakcje w nowym stylu; dodać wariant ograniczonego ruchu i nie uzależniać dostępu do treści od efektów.   |
| Przygotowanie do Sanity        | `src/lib/sanity.ts`, `sanity/schemas/`, `next.config.ts`        | Zachować klienta, schematy, pola PL/EN i konfigurację obrazów z CDN; nie usuwać przy okazji porządkowania CSS.                                       |

### Istotne rozróżnienia techniczne

**Kontakt ma obecnie dwie ścieżki w kodzie.** Formularz wysyła bezpośrednio do `https://api.web3forms.com/submit`, korzystając z `NEXT_PUBLIC_WEB3FORMS_KEY`. Nie wywołuje `/api/contact`. Endpoint serwerowy korzysta z `WEB3FORMS_ACCESS_KEY` i ma własne zabezpieczenia. Jego limit trzech zapytań na minutę w pamięci procesu nie chroni obecnej wysyłki z formularza.

Podczas pierwszego etapu wizualnego nie zmieniać tej topologii. Ewentualne ujednolicenie potraktować jako osobne zadanie z testami i świadomą decyzją. Endpoint bez klucza loguje treść i zwraca sukces — takiego wyniku nie wolno uznawać za dowód dostarczenia wiadomości.

**Sanity jest przygotowane, ale nie podłączone do wyświetlania treści.** W przejrzanych stronach i komponentach nie ma pobierania danych przez klienta Sanity. Nie znaleziono też zaimplementowanej strony Studio. Uruchomienie CMS lub migracja treści nie są warunkiem redesignu.

**Baner i analityka działają niezależnie.** W kodzie akceptacja banera nie steruje montowaniem Analytics. Zachowanie integracji nie oznacza potwierdzenia zgodności prawnej mechanizmu zgód. Ewentualny przegląd prywatności to oddzielny zakres, bez ukrytych zmian podczas redesignu.

## 4. Kierunek wizualny po doprecyzowaniu inspiracji

### Podział ról między trzema inspiracjami

Poniższy podział wynika z preferencji opisanych przez użytkownika, nie z założenia, że trzeba odtworzyć którąkolwiek grę.

| Inspiracja    | Co przejmujemy jako zasadę                                                                                 | Jak zastosować to na stronie                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Witcher 3** | Ruchome tło oraz czytelne przedstawienie wszystkich pozycji menu.                                          | Na desktopie pełna lista sześciu stron jest stale widoczna, ma wyraźny aktywny wybór i proste etykiety. Tło porusza się subtelnie, nie przesuwając tekstu i kontrolek.              |
| **Bastion**   | Główna inspiracja graficzna: bardziej malarska, barwna i jaśniejsza oprawa niż w inspiracji wiedźmińskiej. | Ilustracyjne materiały, wyraziste pociągnięcia pędzla, ciepłe złoto/ochra, morski błękit, zieleń i jasne refleksy. Kolor i światło pozostają widoczne także przy ciemnych panelach. |
| **Trine**     | Interaktywny ekran z postacią jako pomysł na późniejszą zabawę.                                            | Osobna faza po ukończeniu strony: sterowany mag, telekineza bloków, mróz utrwalający rzeźbę i lawa rozpoczynająca nową budowę.                                                      |

Docelowo: malarska tawerna połączona z pracownią maga, czytelne menu na pierwszym planie oraz rozpoznawalny Leszek jako postać do zrekrutowania. **Bastion wyznacza wygląd; Witcher 3 organizację menu i atmosferę ruchu; Trine zakres późniejszej interakcji.** Nie sprowadzać całości do prawie czarnego, realistycznego interfejsu tylko dlatego, że pierwszą inspiracją jest Witcher 3.

Grafiki będą autorskie. Nie kopiujemy znaków, gotowych interfejsów, postaci ani plików z wymienionych gier. Dane zawodowe i funkcjonalność pozostają niezależną warstwą HTML.

| Element    | Proponowana zmiana                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kompozycja | Stała rama menu, boczna nawigacja na dużym ekranie, aktywny panel treści i wyróżniona karta postaci.                                                                     |
| Tło        | Malarska scena z wyraźnym kolorem i światłem, spokojniejsze obszary pod tekstem; czytelne ciemne panele ponad ilustracją. Dzień jaśniejszy i bardziej barwny od nocy.    |
| Karty      | Mniejsze zaokrąglenia, cienkie podwójne obramowania, ornament narożnika i subtelny cień zamiast dużych obłych kafli.                                                     |
| Typografia | Geist pozostaje fontem tekstu i formularzy. Jeden dodatkowy krój o charakterze fantasy/serif wyłącznie dla dużych tytułów, po sprawdzeniu polskich znaków i czytelności. |
| Kolory     | Głęboki morski błękit, drewno, ochra, stare złoto, zieleń i kremowe refleksy; turkus magii jako akcent. Unikać jednolitej szarości lub sepii.                            |
| Ikony      | Spójne proste SVG: księga, zwój, kompas, tarcza, pióro, symbol postaci. Każda ważna ikona ma widoczną etykietę tekstową.                                                 |
| Ruch       | Oprócz wejść paneli: powolny ruch warstw scenerii, subtelna mgiełka/pył i oddech światła. Stałe pozycje menu, bez drgania liter i przesuwania obszarów klikalnych.       |
| CTA        | „Zaproś do drużyny” z jasnym kontekstem „Kontakt i wycena”; drugie CTA nadal pokazuje zakres usług.                                                                      |

Nie dodawać obowiązkowego intro, ekranu „Press Start”, automatycznej muzyki, własnego kursora ani mechaniki odblokowywania informacji. Nie chować istotnych opisów wyłącznie pod hoverem. Rekruter nie musi znać RPG, aby zrozumieć ofertę.

### Ruchome tło niezależne od minigry

Wprowadzić już w redesignie, bez czekania na etap 6. Oddzielić nieruchomą bazę scenerii, dekoracje pierwszego planu i lekkie efekty światła. Animować transformacje/opacity warstw o kilka pikseli i spokojne zmiany natężenia, zamiast odtwarzać ciężki film w tle. Ruch nie może odsłaniać krawędzi ilustracji; zastosować niewielki zapas kadru. Powiązanie z kursorem jest opcjonalne i wyłącznie dekoracyjne.

Wyłączyć ruch przy `prefers-reduced-motion` oraz w niewidocznej karcie. Na telefonie ograniczyć liczbę efektów. Nawigacja, teksty i pola formularza pozostają stabilne; to scena żyje za menu, a nie menu ucieka przed kursorem.

### Układ na komputerze i telefonie

Desktop: lewa kolumna około 240–280 px z nazwiskiem/symbolem, menu, językiem i CTA. Po prawej treść wybranej podstrony. Na stronie głównej karta postaci dzieli przestrzeń z portretem; na dłuższych podstronach pierwszeństwo ma czytanie treści.

Tablet i telefon: zwarty górny pasek oraz rozwijane menu; karta i treść w jednej kolumnie. Bez pomniejszania całego desktopowego interfejsu. Kontakt, język i NDA pozostają łatwo dostępne, a baner cookies nie zasłania końca formularza.

Zachować zwykłe przewijanie dokumentu. Nie wymuszać wysokości całej aplikacji równej viewportowi i nie tworzyć kilku zagnieżdżonych obszarów przewijania. Długi dziennik doświadczenia musi mieścić pełną treść, także przy powiększeniu.

## 5. Dzień, wieczór i noc jako część świata RPG

### Zachowanie, którego nie zmieniamy

| Wariant   | Lokalny czas odwiedzającego | Docelowy klimat                                                                                                                                                    |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `day`     | 06:00–17:59                 | Barwna malarska tawerna/pracownia, światło z okna, ochra i morski błękit. Jaśniejsze otoczenie, nadal ciemne czytelne panele i mniej bieli niż na obecnej stronie. |
| `evening` | 18:00–21:59                 | Światło świec, bursztyn, ciemny brąz i fiolet.                                                                                                                     |
| `night`   | 22:00–05:59                 | Głęboki granat i węgiel, chłodne światło księżyca, spokojna poświata magii.                                                                                        |

Źródłem czasu pozostaje zegar przeglądarki. Nie zastępować go czasem serwera, geolokalizacją, godzinami w Polsce ani samym `prefers-color-scheme`. Ręczny wybór motywu nie jest wymagany; ewentualne przyszłe ustawienie musi zachować opcję automatyczną jako domyślną.

### Proponowane kolory bazowe

Poniższe wartości są punktem startowym do makiety, nie zatwierdzoną paletą. Kontrast trzeba sprawdzić na rzeczywistych komponentach, również z przezroczystością i teksturą.

| Token             | Dzień     | Wieczór   | Noc       |
| ----------------- | --------- | --------- | --------- |
| `--background`    | `#202B30` | `#211C29` | `#0C111A` |
| `--surface`       | `#2D3B3E` | `#302733` | `#17202E` |
| `--surface-light` | `#40514C` | `#433343` | `#253247` |
| `--foreground`    | `#F1E8D8` | `#F0E4DA` | `#E5EAF2` |
| `--muted`         | `#BFB3A0` | `#C1ACBC` | `#A9B8CC` |
| `--primary`       | `#D6B474` | `#D9A56C` | `#D3BC88` |
| `--accent`        | `#94B6A0` | `#B7A0D6` | `#8EACD8` |

Pozostawić istniejące nazwy tokenów i mapowanie `@theme inline`, aby etapowo przebudowywać komponenty. Uzupełnić warianty `--primary-light` i `--accent-light` oraz dodać semantyczne tokeny dla obramowania, fokusu, tekstu na przycisku, błędu i sukcesu. Kolory dekoracji powinny wynikać z tych samych wariantów, zamiast pozostawać zaszyte w SVG i klasach.

Szczególnie ważne: aktualne główne przyciski używają `text-white`. Po zmianie wypełnienia na złoto należy zastosować ciemny tekst przez token typu `--on-primary`, a nie pozostawiać bieli automatycznie. Informacji o błędzie lub aktywnym wyborze nie przekazywać wyłącznie kolorem.

### Sposób wdrożenia automatyki

1. Zachować krótki skrypt w `<head>` ustawiający `data-time` przed pierwszym renderem i ograniczone do właściwego miejsca `suppressHydrationWarning`. Nie przenosić całej inicjalizacji wyłącznie do `useEffect`, co może powodować błysk niewłaściwego motywu.
2. Zachować komponent `TimeTheme`, ale zaplanować aktualizację również wtedy, gdy użytkownik pozostaje na stronie przy zmianie pory. Obecny efekt ustawia atrybut po renderze i nie ma timera; trwały layout nie gwarantuje aktualizacji zegara podczas dalszej nawigacji.
3. Dodać sprawdzenie przy powrocie do widocznej karty oraz timer do kolejnej granicy pory lub prosty interwał minutowy. Usuwać listenery i timer przy odmontowaniu; ustawiać atrybut tylko przy zmianie wartości.
4. Wyznaczanie pory opisać jako małą testowalną funkcję. Inicjalizator przed hydratacją i kod kliencki muszą korzystać z tej samej reguły; jeśli skrypt jest generowany oddzielnie, dodać test zgodności granic.
5. Przejścia kolorów pozostają płynne, ale respektują preferencję ograniczonego ruchu. Wszystkie warianty obejmują menu, formularz, stopkę, baner i ilustracje, a nie samo tło.

Aktualizacja bez przeładowania jest planowanym ulepszeniem istniejącej funkcji, nie opisem jej obecnego działania.

## 6. Przełożenie poszczególnych stron na RPG

Prefiks języka pozostaje bez zmian: poniżej `/` oznacza odpowiednio `/pl` lub `/en`, a pozostałe adresy nadal występują w obu językach.

| Trasa i komponent                       | Docelowy ekran                | Co konkretnie zrobić                                                                                                                                                                                                                             |
| --------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/` — `Hero.tsx`                        | Karta postaci                 | Zamiast wyłącznie centralnego napisu stworzyć panel z nazwiskiem, rzeczywistą rolą konsultanta, opisem wartości dla zespołu, skrótem specjalizacji i portretem/symbolem. Zachować oba CTA.                                                       |
| `/about` — `AboutSection.tsx`           | Postać i księga umiejętności  | Biografię przedstawić jako historię postaci, bez skracania informacji. Cztery kategorie umiejętności pokazać jako czytelne grupy w księdze; każda technologia nadal widoczna.                                                                    |
| `/services` — `ServicesSection.tsx`     | Zadania, w których mogę pomóc | Cztery usługi jako karty zleceń: rzeczywista nazwa, istniejący opis, metaforyczna ikona. Dodatkowe opisy rezultatu tylko po zatwierdzeniu, bez nowych obietnic zakresu.                                                                          |
| `/experience` — `ExperienceSection.tsx` | Dziennik wypraw               | Zachować chronologię i dziewięć wpisów (w tym aktualną pozycję dodaną przed etapem 2). Firmy jako zespoły, z którymi pracowałem, ale nazwy firm i stanowisk bez fikcyjnych zamienników. Aktualnej pozycji nie oznaczać jako ukończonego zadania. |
| `/workflow` — `WorkflowTimeline.tsx`    | Przebieg wspólnego questu     | Dotychczasowe sześć etapów jako czytelna ścieżka. NDA może wizualnie przypominać zwój/pieczęć, ale nazwa i opis dokumentu pozostają dosłowne.                                                                                                    |
| `/contact` — `ContactSection.tsx`       | Zaproszenie do drużyny        | Formularz w panelu rekrutacji. Nagłówek może używać metafory, lecz pola, walidacja i komunikaty pozostają jednoznaczne. Bez nowych obowiązkowych pól i bez dodatkowego kroku przed wysłaniem.                                                    |

W nawigacji łączyć klimat z jasnością, np. „Postać · O mnie”, „Zadania · Usługi”, „Dziennik · Doświadczenie”, „Współpraca” i „Kontakt”. Nie używać samych nieoczywistych symboli. Dla EN przygotować naturalne odpowiedniki, a nie dosłowne tłumaczenie każdej metafory.

Zachować prawdziwe dane zawodowe. Nie dodawać wymyślonych statystyk typu „React 99/100”, liczby ukończonych projektów, poziomów, referencji ani aktualnej dostępności. Obecne „12+ lat” można przenieść na kartę; zmiana liczby wymaga potwierdzenia, nie automatycznego wyliczenia z jednej daty. „Mag TypeScriptu” może być podpisem fabularnym, lecz nie powinien zastąpić tytułu „Konsultant TypeScript & React”.

Klucz `services.development` oznacza obecnie Code Review & Mentoring. Nie interpretować go podczas refaktoru jako nowej oferty pełnej implementacji. Podobnie EN zawiera „Get a free estimate” — zmiany CTA nie powinny przypadkowo usuwać lub rozszerzać istniejących obietnic oferty.

## 7. Mapa zmian w plikach i komponentach

| Plik / grupa                                                                                                  | Planowana zmiana                                                                                                                                                            | Granica bezpieczeństwa                                                                                                |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                                                                                         | Trzy palety RPG, tokeny stanów, obramowania, typografia, animacje i reduced motion. Stopniowo zastąpić dotychczasowe plamy i gradienty odpowiednikami pasującymi do świata. | Nie usuwać używanych klas przed migracją wszystkich wywołań; nie blokować przewijania globalnie.                      |
| `src/app/[locale]/layout.tsx`                                                                                 | Wspólna rama strony, ewentualny font nagłówków, spójny obszar treści.                                                                                                       | Pozostawić layout serwerowy, `await params`, `setRequestLocale`, provider, motyw, Analytics, stopkę i cookies.        |
| `src/components/Navigation.tsx`                                                                               | Menu boczne na desktopie i rozwijane na mobile; aktywny wybór jak w RPG.                                                                                                    | Nadal używać `Link` i `usePathname` z `@/i18n/navigation`; nie zastępować routingu lokalnym stanem zakładek.          |
| `src/components/TimeTheme.tsx`                                                                                | Zachowanie obecnych reguł, aktualizacja czasu podczas otwartej sesji i sprzątanie efektów.                                                                                  | Nie powiązać motywu z językiem ani nie resetować go przy zmianie panelu.                                              |
| `Hero.tsx`, `AboutSection.tsx`                                                                                | Karta postaci, biografia i grupy umiejętności we wspólnych panelach.                                                                                                        | Jedno źródło danych dla powtarzanych specjalizacji; pełne treści pozostają dostępne.                                  |
| `ServicesSection.tsx`, `ExperienceSection.tsx`, `WorkflowTimeline.tsx`                                        | Karty zadań, dziennik i ścieżka współpracy; wspólne nagłówki, tagi, obramowania.                                                                                            | Zachować wszystkie rekordy, kolejność istotną merytorycznie i link pobrania NDA.                                      |
| `ContactSection.tsx`                                                                                          | Wygląd pól, przycisków, fokusu i komunikatów.                                                                                                                               | W pierwszym kroku pozostawić `handleSubmit`, pola i kontrakt Web3Forms; nie łączyć zmiany wyglądu ze zmianą dostawcy. |
| `Footer.tsx`, `CookieBanner.tsx`                                                                              | Dopasowanie paneli, linków i przycisków do trzech palet.                                                                                                                    | Zachować lokalizację, zapamiętywanie akceptacji i pełne linki; nie przykrywać istotnych kontrolek.                    |
| `src/messages/pl.json`, `src/messages/en.json`                                                                | Nowe etykiety fabularne, pomocnicze podpisy i dostępne nazwy kontrolek.                                                                                                     | Aktualizować oba języki razem; zachować pełne znaczenie dotychczasowych informacji.                                   |
| `public/favicon.svg`, `src/app/favicon.ico`                                                                   | Spójny znak LP lub osobisty symbol w nowej palecie.                                                                                                                         | Sprawdzić oba źródła ikon; sam SVG nie powinien pozostawić niespójnego favicon z App Routera.                         |
| `src/i18n/`, `src/proxy.ts`, `src/app/api/contact/route.ts`, `sanity/`, `src/lib/sanity.ts`, `next.config.ts` | Co do zasady bez zmian funkcjonalnych.                                                                                                                                      | Każda konieczna ingerencja osobno uzasadniona i sprawdzona.                                                           |

Proponowane nowe elementy, tworzone tylko wtedy, gdy mają faktyczne zastosowanie:

- `src/components/rpg/RpgShell.tsx` — współdzielona rama dla nawigacji i treści, bez własnego systemu routingu; preferowany komponent serwerowy z przekazanym `children`.
- `src/components/rpg/RpgPanel.tsx` — wspólna powierzchnia, obramowanie i opcjonalny nagłówek; bez narzucania nieprawidłowej semantyki wszystkim użyciom.
- `src/components/rpg/RpgButton.tsx` — wspólny wygląd przycisku/linku z zachowaniem właściwego elementu HTML, stanu disabled i obsługi klawiatury.
- `src/components/rpg/CharacterPortrait.tsx` — portret z ustalonymi wymiarami, tekstem alternatywnym i sensownym wariantem bez ilustracji.
- `src/lib/time-of-day.ts` — czysta reguła wyznaczania pory, jeśli wydzielenie upraszcza inicjalizację i testowanie.
- `public/images/rpg/` — zatwierdzone ilustracje oraz tekstury. Dekoracje wektorowe mogą pozostać SVG/CSS.

Nie tworzyć rozbudowanego systemu komponentów dla jednorazowych ornamentów. Wspólna rama nie powinna wymuszać przeniesienia całego layoutu do klienta. Korzystać z aktualnie zainstalowanej wersji `motion` i lokalnych przewodników Next.js; nie zakładać zgodności API z wcześniejszymi wersjami.

## 8. Zasoby graficzne, dostępność i wydajność

### Grafiki

**Wizerunek ustalony:** wygenerować ilustrację Leszka jako maga na podstawie dostarczonego portretu „ChatGPT Image 30 lip 2026, 12_13_16.png”. Zachować rozpoznawalny kształt twarzy, krótkie włosy, brodę i okulary. Strój i otoczenie zmienić na fantasy; nie odmładzać, nie zastępować twarzy przypadkowym bohaterem, nie zasłaniać jej kapturem. Oryginał pozostaje referencją poza katalogiem publicznym.

Wygenerować osobno portret z przezroczystością, bazową scenerię oraz potrzebne dekoracje. Pierwszy zestaw obejmuje maga, tło tawerny/pracowni i pojedynczy magiczny kamień jako element dekoracyjny. Źródła graficzne przechowywać w `docs/design/rpg/`, a ich status, prompty i parametry opisać w `docs/rpg-assets.md`. Dopiero sprawdzone, zoptymalizowane eksporty trafią do `public/images/rpg/` podczas implementacji. Przezroczystość potwierdzać na kanale alfa pliku, a nie na widocznej szachownicy. Portret nie jest jeszcze gotowym animowanym sprite'em do minigry.

Warianty oświetlenia realizować głównie w CSS; jeśli zmiana scenerii wymaga dodatkowej warstwy, przygotować ją oddzielnie. Nie pobierać trzech dużych scen równocześnie tylko po to, aby zmienić porę dnia. Tekst, przyciski i dane zawodowe pozostają HTML, nigdy częścią obrazka. Proste ikony i ramy nadal tworzyć jako SVG/CSS; nie zastępować czytelnych elementów UI rastrowym obrazkiem menu.

Obrazy dostarczyć w odpowiednich rozmiarach, preferując WebP/AVIF i mechanizm obrazów Next.js zgodnie z lokalną dokumentacją. Portret rezerwuje miejsce przed załadowaniem; dekoracje mają pusty alt lub są poza drzewem dostępności. Nie dodawać nowej zewnętrznej domeny obrazów, jeżeli wystarczą zasoby lokalne.

### Kryteria jakości UI

- Kontrast jako cel projektowy: co najmniej 4,5:1 dla zwykłego tekstu i 3:1 dla istotnych granic kontrolek oraz wskaźnika fokusu. Sprawdzać każdy motyw, także tekst na złotych przyciskach, stan disabled, błędy i linki.
- Jedno główne `h1` na podstronie, logiczne kolejne nagłówki, `main`, `nav`, etykiety pól, link pomijający menu i `aria-current` dla bieżącej strony. Obecnie część samodzielnych podstron zaczyna się od `h2`; skorygować podczas migracji.
- Menu mobilne: lokalizowane `aria-label`, `aria-expanded`, `aria-controls`. Jeśli będzie modalem, także zarządzanie fokusem i Escape; przy zwykłym rozwinięciu nie dodawać niepotrzebnej pułapki fokusu.
- Linki pozostają linkami, przyciski przyciskami. Wizualne „menu gry” nie wymaga ARIA `role="menu"` dla zwykłej nawigacji strony ani `role="tab"` dla odrębnych adresów.
- Widoczny fokus i sensowna kolejność Tab. Przyciski i linki na dotyk mają docelowo co najmniej 44 × 44 px obszaru aktywnego. Układ pozostaje czytelny przy powiększeniu 200% i wąskim ekranie.
- `prefers-reduced-motion` obejmuje CSS i `motion`: wyłączyć ruch dekoracyjny, transformacje i płynne przewijanie dla tej preferencji, zachowując stany i informację zwrotną. Ważna treść nie może pozostać niewidoczna przez niedokończoną animację.
- Wynik wysyłki formularza komunikować także przez odpowiedni region statusu, nie sam kolor. Nie dodawać dekoracji przechwytujących kliknięcia; tła mają `pointer-events: none`.

### Budżet wydajności do sprawdzenia na prototypie

W etapach 0–5 nie dodawać bibliotek 3D ani nowego menedżera stanu. Wykorzystać istniejące CSS, SVG i `motion`. Duże animacje filtrów `blur` oraz ciągłe przekształcanie całego tła zastąpić lżejszą oprawą. Etap 6 ma osobny budżet i ładowanie na żądanie; minigra nie zwiększa obowiązkowego kosztu uruchomienia wszystkich podstron.

Roboczy limit nowych obrazów potrzebnych na pierwszym ekranie: łącznie do około 500 kB po kompresji, z mniejszymi wariantami na mobile. To ograniczenie projektowe do zweryfikowania z jakością portretu, nie wynik pomiaru. Dodatkowy font ograniczyć do koniecznych wag i znaków.

Przed i po zmianach porównać rozmiar JS, ładowanie pierwszego ekranu, przesunięcia układu i płynność na telefonie. Pomiar robić na buildzie produkcyjnym w porównywalnych warunkach, bez obiecywania konkretnego wyniku Lighthouse przed pomiarem.

Metadane pozostają zawodowe i zrozumiałe dla wyszukiwarek oraz podglądów linków. Ich tłumaczenie per locale i ewentualne zmiany `metadataBase` wymagają osobnej kontroli: obecnie baza wskazuje `leszekpawlak.vercel.app`. Nie zmieniać domeny na podstawie samej nazwy repozytorium.

## 9. Kolejność realizacji

Każdy etap powinien kończyć się działającą stroną. Odhaczone są jedynie decyzje i informacje już potwierdzone; pozostałe zadania opisują przyszłe wdrożenie, nie wykonane zmiany kodu.

### Etap 0 — środowisko i punkt odniesienia

- [x] Użytkownik potwierdził działające środowisko dev po instalacji wszystkich pakietów. Nie planować naprawy konfiguracji na podstawie wcześniejszej niepełnej instalacji.
- [x] Uruchomić `npm run lint` i `npm run build`; zapisać istniejące problemy oddzielnie od regresji redesignu. Próby z 26.08.2026: lint blokuje obsługa TypeScript 7 przez `typescript-eslint`; domyślny Turbopack zatrzymuje w sandboxie ograniczenie tworzenia procesu na porcie. Po etapie 2 oficjalny wariant `next build --webpack` oraz osobny `tsc --noEmit` przeszły poprawnie. Szczegóły w [raporcie makiety](design/rpg/README.md) i [raporcie etapu 2](design/rpg/stage-2-report.md).
- [ ] Obejrzeć wszystkie strony PL/EN na desktopie i mobile, zrobić bazowe zrzuty dzień/wieczór/noc i przejść listę funkcji z rozdziału 3.
- [x] Potwierdzić używaną konfigurację wysyłki bez ujawniania kluczy. Formularz używa bezpośrednio Web3Forms i publicznej zmiennej konfiguracyjnej; osobny `/api/contact` ma własną konfigurację, ale obecny UI go nie wywołuje. Test UI etapu 2 objął wyłącznie natywną walidację bez wysyłki; prawdziwy test dostarczenia maila nadal wymaga osobnego uzgodnienia.

Wynik: znany stan wyjściowy i działające narzędzia weryfikacji.

### Etap 1 — zatwierdzenie kierunku

- [x] Uzgodniono podział inspiracji: Witcher 3 — menu/ruch tła, Bastion — oprawa graficzna, Trine — osobna późniejsza interakcja; dostarczono portret do wygenerowania maga.
- [x] Przygotować makietę karty postaci oraz formularza: desktop/mobile, trzy pory. Formularz służy do sprawdzenia czytelności kontrolek, nie tylko atrakcyjności hero. Interaktywny podgląd PL/EN, uruchomienie i wyniki sprawdzeń: [docs/design/rpg/README.md](design/rpg/README.md). Makieta jest odizolowana od działającej aplikacji i symuluje wysyłkę.
- [x] Zatwierdzić paletę, typografię, ramy, ikony i etykiety PL/EN przed przenoszeniem ich na wszystkie podstrony. Użytkownik zatwierdził makietę 26.08.2026 i polecił rozpocząć integrację.

Wynik: zatwierdzony wzorzec interfejsu; brak konieczności projektowania każdej podstrony od zera.

### Etap 2 — fundament wizualny i automatyka czasu

- [x] Wprowadzić trzy zestawy tokenów, semantyczne kolory stanów i wspólne panele/przyciski.
- [x] Zbudować ramę menu i responsywną nawigację, zachowując dotychczasowe linki oraz locale.
- [x] Zachować inicjalizację motywu przed hydratacją; dodać aktualizację przy zmianie pory w otwartej karcie oraz testy granic.
- [x] Dopasować stopkę i cookies; sprawdzić, że wspólny layout nadal montuje wszystkie integracje.

Raport wdrożenia i weryfikacji etapu 2: [docs/design/rpg/stage-2-report.md](design/rpg/stage-2-report.md).

Wynik: wszystkie istniejące strony działają w nowej ramie, nawet zanim każda sekcja otrzyma docelowy układ.

### Etap 3 — migracja ekranów i treści

- [ ] Przebudować `Hero` i `AboutSection`, następnie usługi, doświadczenie, współpracę i kontakt.
- [ ] Przenosić dane bez skracania rekordów, usuwania umiejętności lub zmieniania zakresu usług.
- [ ] Aktualizować PL i EN równolegle; utrzymać dosłowne nazwy usług, formularza i dokumentów obok metafory.
- [ ] Po każdym ekranie sprawdzić nawigację, stany interakcji, trzy motywy i widok mobilny.

Wynik: spójna oprawa całego serwisu, nie pojedynczej strony.

### Etap 4 — ilustracje i dopracowanie

- [ ] Dodać zatwierdzony portret/tło, ewentualny font nagłówków i spójne favicon.
- [ ] Sprawdzić wagę zasobów, czytelność z tłem, rezerwację miejsca i wariant bez załadowanych obrazów.
- [ ] Dopracować animacje, ograniczony ruch, fokus, komunikaty formularza i nakładanie się paneli.
- [ ] Usunąć wyłącznie nieużywane style po sprawdzeniu wszystkich odwołań; zachować funkcje i przygotowane integracje.

Wynik: gotowa oprawa bez pogorszenia użyteczności.

### Etap 5 — regresja i publikacja po akceptacji

- [ ] Przejść macierz testów z rozdziału 10 i ponownie wykonać lint/build.
- [ ] Porównać treści, linki, obrazy, metadane i wydajność ze stanem bazowym.
- [ ] Udostępnić wersję podglądową do akceptacji użytkownika; publikację produkcyjną wykonać dopiero po osobnej zgodzie.
- [ ] Utrzymać małe, rozdzielone zmiany, aby można było cofnąć oprawę bez migracji danych lub zmiany usług zewnętrznych.

### Etap 6 — minigra „Pracownia maga”, po ukończeniu redesignu

- [ ] Dopiero po odbiorze etapów 0–5 przygotować mały prototyp ruchu maga i telekinezy bloków, oddzielony od działającego menu.
- [ ] Zrealizować losowanie luźnych bloków, budowanie kształtu, mróz zapisujący nieruchomą rzeźbę oraz lawę usuwającą zapis i tworzącą nowy zestaw.
- [ ] Dodać walidowany i wersjonowany zapis `localStorage`, odtwarzanie przy powrocie, obsługę odmowy zapisu i uszkodzonych danych.
- [ ] Zapewnić mysz, klawiaturę i dotyk, wyjście z interakcji, reduced motion oraz brak przejmowania skrótów w formularzach.
- [ ] Sprawdzić, że minigra nie wpływa na trasy, locale, motyw, cookies, NDA, formularz ani analitykę.
- [ ] Odebrać minigrę osobno, z macierzą z rozdziału 12. Nie uzależniać publikacji gotowego redesignu od ukończenia tej fazy.

Wynik: dodatkowa zabawa na ekranie głównym i trwała lokalna rzeźba, przy zachowaniu kompletnej strony zawodowej.

## 10. Testy i warunki odbioru

Nie ma obecnie gotowej infrastruktury testowej w repozytorium. Przy wdrożeniu dodać tylko testy pokrywające realne ryzyka: regułę czasu oraz zachowania użytkownika. Dobór narzędzia ustalić przy bazowej weryfikacji działającego środowiska; testy przeglądarkowe mogą korzystać np. z Playwright, a czysta funkcja z lekkiego runnera zgodnego z projektem. Testy minigry są osobnym rozszerzeniem w etapie 6.

| Obszar                | Scenariusze wymagane przed odbiorem                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Routing i języki      | 6 tras × 2 języki; wejście bezpośrednie, odświeżenie, Wstecz/Dalej, aktywna pozycja, przełączenie PL/EN bez utraty podstrony; osobno wejście na `/` i detekcja locale.                                       |
| Trzy pory             | Zrzuty wszystkich tras w dzień, wieczór i noc; brak jasnego błysku przy pełnym załadowaniu; spójność wszystkich komponentów.                                                                                 |
| Granice czasu         | 05:59 → noc, 06:00 → dzień, 17:59 → dzień, 18:00 → wieczór, 21:59 → wieczór, 22:00 → noc; 00:00 → noc. Sprawdzić zmianę podczas otwartej karty i po powrocie z tła, również w innej strefie klienta.         |
| Mobile i powiększenie | Szerokości 320, 390, 768, 1024 i 1440 px; brak poziomego przewijania, przyciętych opisów, kolizji menu, klawiatury ekranowej, CTA i banera; kontrola 200% zoom.                                              |
| Kontakt               | Puste pola, błędny email, honeypot, wysyłanie i blokada powtórnego kliknięcia, sukces z resetem, odpowiedź błędna i awaria sieci z możliwością ponowienia. Automatycznie z mockiem, bez rzeczywistych maili. |
| Endpoint kontaktowy   | Osobno zachowanie `/api/contact`: walidacja, honeypot, limit, błąd dostawcy i brak konfiguracji. Nie utożsamiać go z obecną ścieżką formularza.                                                              |
| NDA                   | Przycisk działa z obu języków, pobiera istniejący PDF z dotychczasową nazwą; pliki PDF/HTML i generator pozostają w repozytorium.                                                                            |
| Cookies               | Widoczny baner w nowym profilu testowym; akceptacja ukrywa go i pozostaje skuteczna po odświeżeniu oraz zmianie locale.                                                                                      |
| Integracje            | Stopka prowadzi do obecnych profili; Analytics pozostaje zamontowane i wymaga sprawdzenia w środowisku podglądowym; konfiguracja Sanity nie została usunięta.                                                |
| Dostępność            | Pełne przejście klawiaturą, widoczny fokus, poprawne nagłówki i nazwy, status formularza, reduced motion, czytelność w trzech paletach.                                                                      |
| Treści i technika     | Porównanie wszystkich 23 umiejętności, 4 usług, 9 wpisów doświadczenia i 6 etapów procesu; komplet PL/EN; brak nowych błędów konsoli/hydratacji; udany lint i build.                                         |

Pełna macierz tras, języków i pór to 36 stanów na wybranej szerokości. Automatyczne zrzuty można wykonać dla całej macierzy na desktopie i telefonie, a pozostałe szerokości sprawdzić na reprezentatywnych ekranach: hero, długi wpis doświadczenia, workflow i formularz. Nie trzeba powielać każdej próby wysyłki dla każdego koloru.

**Definicja ukończenia:** strona jest rozpoznawalna jako menu RPG z Leszkiem jako bohaterem do współpracy; wszystkie trzy pory są ciemniejsze i odróżnialne; każda pozycja listy zachowanych funkcji ma potwierdzony wynik; żadna treść ani ścieżka kontaktu nie wymaga przechodzenia gry; użytkownik zaakceptował wygląd na komputerze i telefonie.

## 11. Ustalenia i pozostałe decyzje

Ustalone: plan bazowy zaakceptowany; wszystkie funkcjonalności i trzy pory zostają; portret użytkownika stanowi referencję maga; tło i dodatkowe grafiki przygotowuje asystent; inspiracje mają role opisane w rozdziale 4; minigra jest ostatnią fazą, nie elementem blokującym redesign; dev działa po instalacji pakietów.

Przyjęty poziom narracji: metafory w nagłówkach, menu i CTA, a opisy usług, doświadczenia, NDA i pól kontaktowych pozostają rzeczowe. Ostateczne podobieństwo portretu, kadrowanie, paletę oraz etykiety oceniamy na pierwszych grafikach i makietach.

**Do potwierdzenia przed minigrą:** czy przy istniejącej rzeźbie nowy losowy zestaw luźnych bloków ma być widoczny obok niej? Roboczo przyjmujemy, że tak, aby jednocześnie spełnić trwałość rzeźby i losowanie bloków przy każdym odświeżeniu. Rzeźba nie zmienia się ani nie znika od samego odświeżenia. Alternatywa to pokazywanie nowych bloków dopiero po lawie — byłby to jawny wyjątek od reguły każdego odświeżenia, więc wymaga decyzji użytkownika.

## 12. Specyfikacja końcowej minigry

### Cel i granica interakcji

Na ekranie głównym można uruchomić niewielką pracownię: poruszać magiem, magicznie przenosić bloki, zbudować dowolny kształt, utrwalić go mrozem, wrócić później do swojej rzeźby i roztopić ją lawą, by zacząć ponownie.

Bloki mogą przypominać fragmenty fantastycznego interfejsu — panele, kamienne tabliczki, fragmenty ram — ale **nie są prawdziwymi przyciskami menu ani polami formularza**. Telekineza nie może zabrać odwiedzającemu linku do kontaktu lub utrudnić czytania treści. Nie dodawać zadań obowiązkowych, punktacji ani ekranów odblokowania oferty.

Proponowany zakres pierwszej wersji: jedna scena 2D, jeden mag, ograniczony zestaw prostych kształtów, trzy zaklęcia i jedna zapisana rzeźba na przeglądarkę. Ruch nie wymaga rozbudowanej platformówki, walki, skakania ani symulacji 3D.

### Stan trwały i stan luźnych bloków

| Obiekt                                   | Trwałość                  | Reguła                                                                                                                 |
| ---------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Pozycja maga, wybór bloku, efekty zaklęć | Tylko bieżąca sesja sceny | Nie muszą przetrwać odświeżenia.                                                                                       |
| Luźne bloki i niezamrożony układ         | Tylko pamięć              | Nowy zestaw przy pełnym odświeżeniu/nowym wejściu i po użyciu lawy. Nie zapisywać ich automatycznie do `localStorage`. |
| Zamrożona rzeźba                         | `localStorage`            | Powstaje po jawnym użyciu mrozu; zachowuje kształt, pozycje i wygląd przy kolejnym wejściu. Nie podlega losowaniu.     |

Losować kształty, rozmiary, kolory/materiały i pozycje startowe w kontrolowanych granicach: przykładowo 12–18 bloków z kilku prostych rodzin. To wstępny parametr do dostrojenia po prototypie. Zestaw ma pozwalać na budowanie i mieścić się w scenie; nie używać nieograniczonego chaosu lub losowania bloków poza ekranem.

Losowanie odbywa się raz na wejście/pełne odświeżenie i po lawie, nie przy każdym renderze React, ruchu myszy, zmianie pory ani przełączeniu PL/EN. W ramach jednej otwartej strony zachować scenę także po odwiedzeniu innej podstrony i powrocie. Źródło losowości w testach musi być kontrolowalne. Zmiana języka nie tworzy osobnej rzeźby.

### Zaklęcia

| Zaklęcie   | Działanie                                                                                                                    | Ograniczenia                                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Telekineza | Wybranie, uniesienie i przenoszenie luźnego bloku; opcjonalnie obrót i delikatne przyciąganie do siatki.                     | Nie porusza zamrożoną rzeźbą ani prawdziwym UI. Reakcja widoczna także bez animowanych efektów.                                                                                       |
| Mróz       | Zamrożenie bloków ułożonych w oznaczonym obszarze budowy, zebranie ich geometrii i zapis rzeźby.                             | Brak pustego zapisu. Jedna rzeźba; istniejącej nie zastępować przypadkowo nową. W pierwszej wersji odblokowanie/ponowna budowa następuje przez lawę.                                  |
| Lawa       | Roztopienie całej rzeźby, usunięcie jej konkretnego klucza z `localStorage` i wygenerowanie świeżego zestawu luźnych bloków. | Nigdy `localStorage.clear()`. Operacja nie zmienia cookies, języka ani innych ustawień. Przy istniejącym zapisie zabezpieczyć przed przypadkowym skrótem, np. krótkim potwierdzeniem. |

Zwykłe odświeżenie, zmiana podstrony, pory dnia, języka lub zamknięcie gry nie usuwa poprawnego zapisu. Po mrozie kształt staje się nieruchomy, bez dalszego osiadania fizyki. Nie mieszać „zamrożenia wizualnego” z obietnicą zapisu: komunikat o zachowaniu na następne wejście dopiero po udanej operacji storage.

**Robocza interpretacja przy istniejącym zapisie:** odtworzyć rzeźbę i obok wylosować nową pulę luźnych bloków, bez nadpisywania zapisu. Do czasu lawy nie można zastąpić zamrożonej rzeźby kolejnym mrozem. To zachowanie wymaga potwierdzenia wskazanego w rozdziale 11.

### Kontrakt zapisu

Proponowany własny klucz: `lp:rpg-sculpture:v1`. Zapis zawiera wersję schematu, czas utworzenia, wymiary logicznego świata oraz listę bloków: identyfikator, typ kształtu/materiału, rozmiar, współrzędne i obrót. Efekty, zaznaczenie i animacje nie należą do zapisu. Nie zapisywać obrazów base64 ani referencyjnego portretu.

Użyć stałych współrzędnych świata i skalowania sceny do ekranu; nie utrwalać bezpośrednio pikseli viewportu. Dzięki temu rzeźba nie rozsypie się po zmianie rozmiaru okna. Zmiany oświetlenia mogą wpływać na renderowanie rzeźby, ale nie zmieniają jej danych.

Przy uruchomieniu najpierw odczytać i zwalidować snapshot, a dopiero potem udostępnić akcje zapisujące. Nie wykonywać autosave pustego stanu przed zakończeniem odczytu. Walidować rozmiar danych, limit bloków, skończone współrzędne, dozwolone typy i wersję; nigdy nie renderować zawartości zapisu jako HTML lub wykonywalnego kodu.

Obsłużyć błędny JSON, nieznaną wersję, brak dostępu oraz przekroczony limit storage. Nie usuwać uszkodzonego lub nowszego zapisu po cichu; wyświetlić informację i pozwolić świadomie zresetować go lawą. Przy odmowie zapisu gra może działać w pamięci, z jednoznaczną informacją, że rzeźba nie przetrwa zamknięcia. Jeżeli usunięcie trwałego zapisu nie powiedzie się, nie zgłaszać udanego resetu, który przy odświeżeniu przywróciłby starą rzeźbę.

To zapis lokalny dla tej przeglądarki i domeny, wspólny dla PL/EN; nie synchronizacja pomiędzy urządzeniami lub domeną podglądową i produkcyjną. Czyszczenie danych przeglądarki lub tryb prywatny może usunąć rzeźbę niezależnie od zaklęć. Należy to jasno wyjaśnić w krótkiej pomocy.

### Sterowanie i integracja ze stroną

Desktop: klawisze ruchu działają tylko po wejściu w scenę; mysz służy do wyboru i przenoszenia bloków, a zaklęcia mają również widoczne przyciski. Zaplanować klawiaturowy tryb wyboru/przesuwania bloku, tak aby strzałki nie poruszały równocześnie magiem i blokiem. Escape kończy przenoszenie lub oddaje sterowanie stronie. Nie przejmować klawiszy, kiedy fokus jest w formularzu lub poza sceną.

Telefon: widoczne sterowanie ruchem, wybór zaklęć i obsługa przenoszenia przez dotyk. Przechwytywać gest tylko wewnątrz aktywnej sceny; pozostawić przewijanie strony poza nią. UI i instrukcje w PL/EN. Reduced motion ogranicza cząsteczki, trzęsienie i błyski, ale pozwala wykonywać te same akcje.

Scena ma własny przycisk wejścia/wyjścia i nie zasłania pełnej listy stron na desktopie. Nie jest ekranem startowym blokującym portal. Zapisana rzeźba może być wyświetlana jako spokojna dekoracja bez uruchamiania całej symulacji. Awaria modułu gry pozostawia normalną stronę, kontakt i nawigację działające.

### Proponowana architektura — dopiero w etapie 6

- `src/components/rpg/playground/MagePlayground.tsx` — klientowy punkt wejścia ładowany na żądanie, pomoc i kontrolki.
- `src/components/rpg/playground/PlaygroundScene.tsx` — scena, postać, render bloków i obsługa interakcji; nie zawiera prawdziwej nawigacji strony.
- `src/components/rpg/playground/SculpturePreview.tsx` — lekki podgląd zwalidowanej rzeźby, bez aktywnej gry.
- `src/lib/rpg/sculpture.ts` — typy, walidacja i serializacja wersjonowanego zapisu.
- `src/lib/rpg/storage.ts` — odczyt, zapis oraz usunięcie wyłącznie własnego klucza, z obsługą błędów.
- `src/lib/rpg/blocks.ts` — generator zestawu z wstrzykiwanym źródłem losowości, ograniczeniami sceny i stabilnymi identyfikatorami.
- `public/images/rpg/playground/` — ewentualne osobne sprite'y maga, materiały i efekty przygotowane według potrzeb prototypu; nie zakładać, że statyczny portret wystarczy do animacji chodzenia.

Najpierw sprawdzić mały prototyp DOM/SVG lub canvas 2D. Jeżeli potrzebna będzie fizyka, jej bibliotekę dobrać do udowodnionej potrzeby i ładować tylko w module gry. Nie dodawać ciężkiego silnika do globalnego layoutu. Zatrzymywać pętlę animacji po wyjściu, ukryciu karty lub przejściu na inną stronę; zachować stan sesji potrzebny po powrocie.

### Osobna macierz odbioru minigry

| Scenariusz                                  | Oczekiwany wynik                                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pierwsze wejście, brak zapisu               | Mag i poprawny losowy zestaw; żadnej pustej rzeźby w storage.                                                    |
| Odświeżenie bez użycia mrozu                | Nowy losowy zestaw; niezamrożony układ nie wraca.                                                                |
| Mróz → odświeżenie → ponowne wejście        | Ta sama geometria rzeźby, blok po bloku; brak nadpisania losowaniem i brak drgań fizyki.                         |
| Odświeżenie z istniejącą rzeźbą             | Rzeźba bez zmian; zachowanie nowej puli luźnych bloków zgodne z zatwierdzoną interpretacją z rozdziału 11.       |
| Lawa → odświeżenie                          | Własny klucz rzeźby nie istnieje, stara rzeźba nie wraca, pojawiają się nowe bloki.                              |
| Lawa przy innych danych strony              | Klucz cookies i inne wpisy `localStorage` pozostają nietknięte.                                                  |
| Przełączenie PL/EN, pory i podstrony        | Brak skasowania zapisu lub nieplanowanego przelosowania w obrębie sesji; powrót do tej samej sceny.              |
| Resize / telefon po zapisaniu               | Te same proporcje i układ dzięki współrzędnym świata; żaden blok nie ucieka poza dostępny obszar.                |
| Błędny JSON, nieznana wersja, limit storage | Kontrolowany komunikat, działająca strona, brak fałszywej informacji o zapisie lub bezgłośnego kasowania danych. |
| Klawiatura, mysz, dotyk i reduced motion    | Te same podstawowe możliwości; fokus, przewijanie i wpisywanie wiadomości pozostają bez konfliktów.              |
| Wyjście / ukrycie karty / błąd modułu       | Pętla gry zatrzymana, strona i kontakt nadal używalne.                                                           |

Jednostkowo testować walidację snapshotu, operacje storage, granice losowania i reguły mróz/lawa. W przeglądarce sprawdzić pełen cykl budowa → mróz → odświeżenie → lawa → odświeżenie oraz brak regresji podstawowej strony. Nie wystarczy sam wizualny efekt lodu lub stopienia.
