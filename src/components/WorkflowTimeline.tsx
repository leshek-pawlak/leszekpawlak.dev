"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useState } from "react";

const steps = [
  {
    key: "inquiry",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    key: "nda",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    key: "scope",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    key: "estimate",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "delivery",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    key: "success",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
] as const;

export function WorkflowTimeline() {
  const t = useTranslations("workflow");
  const [showNda, setShowNda] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20 sm:-translate-x-px" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div
                  className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    isEven ? "sm:pr-0 sm:text-right" : "sm:pl-0 sm:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-surface border border-surface-light rounded-xl p-6 hover-tilt"
                  >
                    <span className="inline-block text-xs font-mono text-primary mb-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`steps.${step.key}.description`)}
                    </p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.1 + 0.2,
                    }}
                    className="w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-primary shadow-lg glow-primary"
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              </motion.div>
            );
          })}
        </div>

        {/* NDA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 bg-surface border border-surface-light rounded-2xl p-8 sm:p-10"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t("nda_section.title")}
            </h2>
            <p className="text-muted max-w-lg mx-auto">
              {t("nda_section.description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/nda-leszek-pawlak.html"
              download="NDA-Leszek-Pawlak.html"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-light transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("nda_section.download")}
            </a>
            <button
              onClick={() => setShowNda(!showNda)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {t("nda_section.preview")}
            </button>
          </div>

          {/* NDA Preview */}
          {showNda && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 p-6 bg-background rounded-xl border border-surface-light max-h-[60vh] overflow-y-auto"
            >
              <NdaContent />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function NdaContent() {
  return (
    <div className="prose prose-sm max-w-none text-foreground/90 [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_p]:text-muted [&_p]:leading-relaxed [&_ol]:text-muted [&_ol]:leading-relaxed [&_li]:mb-1">
      <h2 className="text-center !text-xl !font-bold !mt-0">
        UMOWA O ZACHOWANIU POUFNOŚCI (NDA)
      </h2>
      <p className="text-center text-sm">Non-Disclosure Agreement</p>

      <p>zawarta w dniu ______________ r. w ______________ pomiędzy:</p>

      <p>
        <strong>Stroną Ujawniającą (dalej „Zleceniodawca"):</strong>
        <br />
        ______________ (nazwa firmy / imię i nazwisko)
        <br />
        z siedzibą: ______________
        <br />
        NIP: ______________
        <br />
        REGON: ______________
        <br />
        reprezentowaną przez: ______________
      </p>

      <p>
        <strong>Stroną Otrzymującą (dalej „Konsultant"):</strong>
        <br />
        IT&amp;TEGES LESZEK PAWLAK
        <br />
        jednoosobowa działalność gospodarcza
        <br />
        NIP: 7811820060
        <br />
        REGON: 366290715
        <br />
        e-mail: itenteges@gmail.com
      </p>

      <p>zwanymi łącznie „Stronami", a każda z osobna „Stroną".</p>

      <h2>§1 Definicje</h2>
      <ol>
        <li>
          <strong>Informacje Poufne</strong> — wszelkie informacje techniczne,
          handlowe, organizacyjne, finansowe, strategiczne lub inne informacje
          dotyczące działalności którejkolwiek ze Stron, przekazane drugiej
          Stronie w formie pisemnej, elektronicznej, ustnej lub w jakiejkolwiek
          innej formie w związku ze Współpracą, w tym w szczególności: kod
          źródłowy, dokumentacja techniczna, architektury systemów, bazy danych,
          know-how, plany biznesowe, dane klientów, warunki handlowe oraz
          wszelkie informacje oznaczone jako poufne.
        </li>
        <li>
          <strong>Współpraca</strong> — usługi konsultingowe w zakresie
          TypeScript, React, JavaScript i technologii webowych świadczone przez
          Stronę Otrzymującą na rzecz Strony Ujawniającej.
        </li>
        <li>
          <strong>Dane Osobowe</strong> — dane osobowe w rozumieniu art. 4 pkt 1
          Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
        </li>
      </ol>

      <h2>§2 Przedmiot umowy</h2>
      <ol>
        <li>
          Strony zobowiązują się wzajemnie do zachowania w tajemnicy wszelkich
          Informacji Poufnych uzyskanych od drugiej Strony w trakcie i w związku
          ze Współpracą.
        </li>
        <li>
          Żadna ze Stron nie ujawni Informacji Poufnych drugiej Strony osobom
          trzecim bez uprzedniej pisemnej zgody Strony, której informacje
          dotyczą.
        </li>
        <li>
          Niniejsza umowa ma charakter dwustronny — zobowiązania dotyczące
          ochrony Informacji Poufnych obowiązują obie Strony w równym stopniu.
        </li>
      </ol>

      <h2>§3 Zakres zobowiązania</h2>
      <p>Każda ze Stron zobowiązuje się do:</p>
      <ol>
        <li>
          Wykorzystywania Informacji Poufnych drugiej Strony wyłącznie w celu
          realizacji Współpracy.
        </li>
        <li>
          Zabezpieczenia Informacji Poufnych przed nieuprawnionym dostępem osób
          trzecich z zachowaniem co najmniej takiego samego stopnia ochrony,
          jaki stosuje wobec własnych informacji poufnych, lecz nie mniej niż z
          należytą starannością.
        </li>
        <li>
          Ograniczenia dostępu do Informacji Poufnych wyłącznie do osób, które
          muszą je znać w celu realizacji Współpracy, pod warunkiem że osoby te
          zostały poinformowane o poufnym charakterze informacji i zobowiązane
          do zachowania poufności.
        </li>
        <li>
          Niezwłocznego powiadomienia drugiej Strony o każdym przypadku
          naruszenia poufności lub podejrzeniu takiego naruszenia, nie później
          niż w ciągu 48 godzin od powzięcia wiadomości o takim zdarzeniu.
        </li>
        <li>
          Niekopiowania, niepowielania i niereprodukcji Informacji Poufnych,
          chyba że jest to niezbędne do realizacji Współpracy.
        </li>
      </ol>

      <h2>§4 Wyłączenia</h2>
      <p>
        Zobowiązanie do zachowania poufności nie obejmuje informacji, które:
      </p>
      <ol>
        <li>
          Są lub staną się publicznie dostępne bez winy Strony otrzymującej te
          informacje.
        </li>
        <li>
          Były prawomiernie znane Stronie otrzymującej przed ich ujawnieniem
          przez drugą Stronę, co Strona otrzymująca jest w stanie wykazać za
          pomocą dokumentacji.
        </li>
        <li>
          Zostały niezależnie opracowane przez Stronę otrzymującą bez
          wykorzystania Informacji Poufnych drugiej Strony.
        </li>
        <li>
          Zostały prawomiernie uzyskane od osoby trzeciej, która nie była
          zobowiązana do zachowania poufności wobec Strony ujawniającej.
        </li>
        <li>
          Muszą zostać ujawnione na podstawie bezwzględnie obowiązujących
          przepisów prawa, prawomocnego orzeczenia sądu lub decyzji właściwego
          organu administracji publicznej.
        </li>
      </ol>

      <h2>§5 Okres obowiązywania</h2>
      <ol>
        <li>
          Niniejsza umowa obowiązuje od dnia jej podpisania przez okres 3
          (trzech) lat.
        </li>
        <li>
          Zobowiązanie do zachowania poufności pozostaje w mocy również po
          zakończeniu Współpracy przez okres wskazany w punkcie 1, licząc od
          dnia zakończenia Współpracy.
        </li>
        <li>
          Każda ze Stron może wypowiedzieć niniejszą umowę z zachowaniem
          30-dniowego okresu wypowiedzenia w formie pisemnej. Wypowiedzenie nie
          zwalnia Stron z obowiązku zachowania poufności informacji otrzymanych
          przed datą wypowiedzenia.
        </li>
      </ol>

      <h2>§6 Zwrot materiałów</h2>
      <ol>
        <li>
          Po zakończeniu Współpracy lub na żądanie którejkolwiek ze Stron, druga
          Strona zobowiązuje się do niezwłocznego zwrotu lub trwałego
          zniszczenia wszelkich materiałów zawierających Informacje Poufne, w
          terminie 14 dni od otrzymania żądania.
        </li>
        <li>
          Na żądanie Strony ujawniającej, Strona otrzymująca potwierdzi na
          piśmie fakt zniszczenia materiałów zawierających Informacje Poufne.
        </li>
      </ol>

      <h2>§7 Ochrona danych osobowych (RODO)</h2>
      <ol>
        <li>
          W zakresie, w jakim w ramach Współpracy dochodzi do udostępnienia
          Danych Osobowych, Strony zobowiązują się do ich przetwarzania zgodnie
          z Rozporządzeniem (UE) 2016/679 (RODO) oraz ustawą z dnia 10 maja 2018
          r. o ochronie danych osobowych.
        </li>
        <li>
          Strony zobowiązują się do wdrożenia odpowiednich środków technicznych
          i organizacyjnych zapewniających ochronę przetwarzanych Danych
          Osobowych, zgodnie z art. 32 RODO.
        </li>
        <li>
          W przypadku konieczności powierzenia przetwarzania Danych Osobowych,
          Strony zawrą odrębną umowę powierzenia przetwarzania danych osobowych
          zgodnie z art. 28 RODO.
        </li>
      </ol>

      <h2>§8 Odpowiedzialność</h2>
      <ol>
        <li>
          W przypadku naruszenia postanowień niniejszej umowy, Strona
          naruszająca ponosi odpowiedzialność za wyrządzoną szkodę na zasadach
          ogólnych Kodeksu cywilnego.
        </li>
        <li>
          Odpowiedzialność obejmuje zarówno szkodę rzeczywistą (damnum
          emergens), jak i utracone korzyści (lucrum cessans).
        </li>
      </ol>

      <h2>§9 Postanowienia końcowe</h2>
      <ol>
        <li>Niniejsza umowa podlega prawu polskiemu.</li>
        <li>
          Wszelkie zmiany niniejszej umowy wymagają formy pisemnej pod rygorem
          nieważności.
        </li>
        <li>
          W sprawach nieuregulowanych niniejszą umową zastosowanie mają przepisy
          Kodeksu cywilnego oraz ustawy o zwalczaniu nieuczciwej konkurencji.
        </li>
        <li>
          Ewentualne spory Strony będą starały się rozwiązywać polubownie. W
          przypadku braku porozumienia, spory rozstrzygane będą przez sąd
          powszechny właściwy dla siedziby Strony Ujawniającej.
        </li>
        <li>
          Jeżeli którekolwiek postanowienie niniejszej umowy zostanie uznane za
          nieważne, nie wpłynie to na ważność pozostałych postanowień.
        </li>
        <li>
          Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla
          każdej ze Stron.
        </li>
      </ol>

      <div className="mt-10 grid grid-cols-2 gap-8">
        <div>
          <p className="border-t border-surface-light pt-4 text-center">
            <strong>Strona Ujawniająca</strong>
            <br />
            <span className="text-xs">(podpis i pieczęć)</span>
          </p>
        </div>
        <div>
          <p className="border-t border-surface-light pt-4 text-center">
            <strong>Strona Otrzymująca</strong>
            <br />
            <span className="text-xs">(Leszek Pawlak)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
