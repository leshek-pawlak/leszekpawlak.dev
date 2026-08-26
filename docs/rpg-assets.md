# Grafiki do redesignu RPG

Data: 26.08.2026. Status: pierwsze ilustracje do oceny kierunku i przygotowania makiet. Nie są jeszcze podłączone do strony ani zoptymalizowane do produkcji.

## Wybrane pliki

| Zasób | Plik w repozytorium | Wymiary | Rozmiar | Zastosowanie |
| --- | --- | --- | --- | --- |
| Leszek jako mag | `docs/design/rpg/leszek-mage-card-v3.png` | 1024 × 1536 px | 2 253 612 B | Ilustracja karty postaci: rozpoznawalna twarz, okulary, broda, niebieska szata, księga i laska. Ciemne nieprzezroczyste tło. |
| Tawerna / pracownia | `docs/design/rpg/tavern-workshop-background-v1.png` | 1672 × 941 px | 1 862 323 B | Baza scenerii: spokojniejsza lewa część pod menu, malarskie okno i krajobraz po prawej. |
| Magiczny kamień | `docs/design/rpg/arcane-runestone-card-v3.png` | 1254 × 1254 px | 1 353 640 B | Dekoracyjna ilustracja rekwizytu oraz referencja materiałów dla przyszłych bloków. Ciemne nieprzezroczyste tło. |

Wszystkie trzy pliki są PNG RGB, bez kanału alfa. Metadane, źródłowe pliki generatora i sumy SHA-256 zapisano w `docs/design/rpg/manifest.json`. Wybrane pliki skopiowano do repozytorium bez modyfikacji; oryginały generatora pozostawiono na miejscu.

Surowy portret użytkownika „ChatGPT Image 30 lip 2026, 12_13_16.png” posłużył wyłącznie jako referencja tożsamości przy generowaniu maga. Nie został skopiowany do repozytorium ani do `public/`. Nie służył jako referencja tła lub kamienia.

## Metoda i prompty

Użyto wbudowanego narzędzia **`image_gen.imagegen`**, bez CLI, zewnętrznego API i bez klucza `OPENAI_API_KEY`.

Pełne, dosłowne prompty oraz ścieżki referencji znajdują się w `docs/rpg-assets-prompts.json`:

- `generation`: trzy niezależne generacje — postać na podstawie portretu, autorskie tło i pojedynczy kamień.
- `backgroundExtractionAttempts`: dwie próby uzyskania rzeczywistej przezroczystości z wygenerowanych ilustracji.
- `opaqueCardEdits`: końcowe edycje postaci i kamienia na celowo nieprzezroczystym, ciemnym tle. Te wersje wybrano do repozytorium.

Kierunek: ilustracyjna oprawa i ciepłe/chłodne kolory inspirowane preferencją użytkownika dotyczącą Bastionu, czytelne miejsce na menu inspirowane zasadą z Witchera 3. Postać i sceneria są autorskie; nie użyto plików, postaci ani interfejsów z tych gier. Minigra inspirowana interaktywnością Trine pozostaje osobnym etapem planu.

## Sprawdzenie i ograniczenia

Obejrzano wygenerowane obrazy i sprawdzono wymiary, format oraz obecność kanału alfa. Zapisane pliki są identyczne ze wskazanymi źródłami; sumy kontrolne umożliwiają późniejsze porównanie.

Pierwotne wersje portretu i kamienia, mimo polecenia przezroczystości, zawierały szachownicę namalowaną w obrazie RGB. Próba ekstrakcji przez narzędzie obrazowe również nie dostarczyła kanału alfa. Tych wersji nie wybrano jako zasobów do repozytorium. Wybrane warianty `card-v3` mają jednolite ciemne tło bez szachownicy i nadają się do kompozycji w kartach.

**Portret i kamień nie są przezroczystymi warstwami.** Nie należy nakładać ich na scenerię z założeniem, że tło samo zniknie. Jeżeli projekt makiety wymaga swobodnie wyciętej postaci lub rekwizytu, potrzebny jest osobny poprawny eksport alfa i ponowna kontrola krawędzi. Alternatywna ścieżka przez CLI/API wymaga wcześniejszego uzgodnienia i skonfigurowanego `OPENAI_API_KEY`; nie uruchamiano jej w tym zadaniu.

Portret jest ilustracją, nie sprite'em do chodzenia. Kamień jest pojedynczym rekwizytem, nie gotowym zestawem losowych kształtów z geometrią kolizji. Tło jest nieruchomym obrazem bazowym, nie gotową animacją; planowany ruch warstw, światło i efekty zostaną dodane w kodzie podczas redesignu.

Nie wykonywano jeszcze oceny w przeglądarce: finalnego kadrowania mobile, kontrastu tekstu na scenerii, przejść dzień/wieczór/noc i wydajności. Podobieństwo portretu oraz docelowy stopień malarskiej stylizacji podlegają ocenie użytkownika.

## Następny krok z zasobami

1. Ocenić postać i scenerię w makiecie karty głównej oraz kontaktu, zgodnie z planem redesignu.
2. Ustalić, czy portret pozostaje ilustracją w ciemnej karcie, czy potrzebne jest poprawne wycięcie tła.
3. Przygotować eksporty WebP/AVIF, odpowiednie kadry i rozmiary dla desktop/mobile. Obecne PNG to pliki źródłowe o łącznej wadze około 5,47 MB, nie pliki do bezpośredniego ładowania na pierwszym ekranie.
4. Umieścić dopiero gotowe eksporty w `public/images/rpg/`, zarezerwować ich rozmiary w layoucie i podłączyć do UI.
5. W etapie 6 przygotować według prototypu osobne sprite'y postaci, kształty bloków i efekty mrozu/lawy. Nie uzależniać wcześniejszego redesignu od ich powstania.

Pełen plan, w tym zachowanie wszystkich funkcji, automatyczne trzy pory i zasady zapisu minigry, znajduje się w `docs/plan-redesign-rpg.md`.
