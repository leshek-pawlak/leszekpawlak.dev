/* Isolated design prototype. No requests, analytics, or browser storage. */
(() => {
  "use strict";

  const copy = {
    pl: {
      previewControls: "Sterowanie makietą",
      previewTitle: "RPG / ETAP 01",
      previewSubtitle: "Karta postaci i kontakt",
      lighting: "Światło",
      automatic: "Automatycznie",
      day: "Dzień",
      evening: "Wieczór",
      night: "Noc",
      previewWidth: "Szerokość makiety",
      responsive: "Responsywny",
      phone: "Telefon",
      motionOn: "Ruch tła: wł.",
      motionOff: "Ruch tła: wył.",
      motionReduced: "Ruch: ograniczony systemowo",
      cookiePreview: "Baner cookies",
      formState: "Stan formularza",
      stateIdle: "Gotowy",
      stateSending: "Wysyłanie",
      stateSuccess: "Sukces",
      stateError: "Błąd",
      previewNotice:
        "Makieta do oceny wyglądu. Dostępne są karta postaci i kontakt. Wiadomości nie są wysyłane.",
      skip: "Przejdź do treści",
      brandLabel: "Leszek Pawlak — karta postaci",
      brandSubtitle: "KONSULTANT · TWÓJ SOJUSZNIK",
      openMenu: "Otwórz menu",
      closeMenu: "Zamknij menu",
      explore: "POZNAJ SWOJEGO SOJUSZNIKA",
      mainNavigation: "Nawigacja główna",
      navCharacter: "Karta postaci",
      navHome: "Strona główna",
      navAbout: "Historia postaci",
      about: "O mnie",
      navServices: "Księga zaklęć",
      services: "Usługi · podgląd",
      navExperience: "Dziennik wypraw",
      experience: "Doświadczenie",
      navWorkflow: "Wspólny quest",
      workflow: "Współpraca",
      navContact: "Zaproś do drużyny",
      contact: "Kontakt",
      menuScope:
        "Historia, dziennik i współpraca: układ menu do oceny. Pełne ekrany w kolejnym etapie.",
      elsewhere: "POZA TAWERNĄ",
      characterKicker: "POSTAĆ DO TWOJEJ DRUŻYNY",
      professionalTitle: "Konsultant TypeScript & React",
      portraitAlt:
        "Leszek Pawlak jako mag w niebieskiej szacie, z księgą i laską",
      classLabel: "KLASA POSTACI",
      className: "Mag TypeScriptu",
      classCaption: "Architektura. Kod. Wspólne questy.",
      storyLine: "Dobre questy przechodzi się razem.",
      heroDescription:
        "12+ lat praktycznego doświadczenia w ekosystemie JavaScript. Pomagam zespołom podejmować lepsze decyzje architektoniczne, unikać kosztownych błędów i dostarczać szybciej.",
      years: "lat doświadczenia",
      specialty: "Architektura<br />i jakość kodu",
      invite: "Zaproś do drużyny",
      help: "Jak mogę pomóc",
      estimateNote: "Porozmawiajmy o projekcie i wycenie.",
      equipment: "SPRAWDZONE NARZĘDZIA",
      contactKicker: "POCZĄTEK WSPÓLNEJ WYPRAWY",
      contactTitle: "Zaproś mnie<br />do drużyny.",
      contactDescription:
        "Masz wyzwanie techniczne? Porozmawiajmy o tym, jak mogę pomóc Twojemu zespołowi.",
      formTitle: "Wiadomość do maga",
      formDisclaimer: "Tryb makiety — żadne dane nie opuszczają tej strony.",
      nameLabel: "Imię i nazwisko",
      emailLabel: "Email",
      messageLabel: "Wiadomość",
      namePlaceholder: "Jak się nazywasz?",
      emailPlaceholder: "ty@firma.pl",
      messagePlaceholder:
        "Opowiedz mi o queście, przed którym stoi Twój zespół…",
      send: "Wyślij wiadomość",
      sending: "Wysyłanie…",
      requiredFields: "Wszystkie pola są wymagane.",
      statusSending: "Podgląd: trwa wysyłanie wiadomości…",
      statusSuccess:
        "Podgląd sukcesu: wiadomość wysłana. W makiecie nic nie zostało wysłane — to symulacja komunikatu.",
      statusError:
        "Podgląd błędu: nie udało się wysłać wiadomości. Spróbuj ponownie. Dane w polach pozostają bez zmian.",
      partySupport: "WSPARCIE DLA DRUŻYNY",
      questTitle: "Twój quest.<br />Moje doświadczenie.",
      serviceArchitecture: "Konsulting architektoniczny",
      serviceEstimation: "Wycena i planowanie projektów",
      serviceAI: "Strategia integracji AI",
      ndaTitle: "Najpierw zaufanie.",
      ndaDescription:
        "Szczegóły projektu mogą poczekać na podpisanie umowy o poufności.",
      ndaDownload: "Pobierz NDA PL/EN",
      footerLine: "Dobre rozwiązania zaczynają się od rozmowy.",
      cookieBannerLabel: "Podgląd banera cookies",
      cookieMessage:
        "Ta strona używa plików cookies, aby zapewnić najlepsze wrażenia z przeglądania. Kontynuując, wyrażasz zgodę na ich użycie.",
      cookieDisclaimer:
        "Podgląd banera — ta makieta nie zapisuje zgód ani nie uruchamia analityki.",
      accept: "Rozumiem",
      servicesKicker: "KSIĘGA ZAKLĘĆ · USŁUGI",
      closeServices: "Zamknij podgląd usług",
      servicesTitle: "Jak mogę pomóc",
      autoSuffix: "automatycznie",
      serviceDetails: [
        [
          "Konsulting architektoniczny",
          "Dogłębne przeglądy architektury TypeScript/React. Pomagam identyfikować wąskie gardła, sugeruję skalowalne wzorce i prowadzę zespół ku utrzymywalnym rozwiązaniom.",
        ],
        [
          "Wycena i planowanie projektów",
          "Realistyczna estymacja projektów oparta na praktycznym doświadczeniu. Od MVP po złożone systemy — szczegółowa analiza wymagań, ocena ryzyka i planowanie roadmapy.",
        ],
        [
          "Code Review & Mentoring",
          "Podnoszenie jakości kodu zespołu. Dokładne code review, warsztaty z best practices i praktyczny mentoring w TypeScript, React i Node.js.",
        ],
        [
          "Strategia integracji AI",
          "Praktyczne doradztwo w zakresie integracji LLM i usług AI z aplikacjami webowymi. Od oceny wykonalności po wzorce implementacji gotowe na produkcję.",
        ],
      ],
    },
    en: {
      previewControls: "Prototype controls",
      previewTitle: "RPG / PHASE 01",
      previewSubtitle: "Character and contact",
      lighting: "Lighting",
      automatic: "Automatic",
      day: "Day",
      evening: "Evening",
      night: "Night",
      previewWidth: "Prototype width",
      responsive: "Responsive",
      phone: "Phone",
      motionOn: "Background: moving",
      motionOff: "Background: paused",
      motionReduced: "Motion: reduced by system",
      cookiePreview: "Cookie banner",
      formState: "Form state",
      stateIdle: "Ready",
      stateSending: "Sending",
      stateSuccess: "Success",
      stateError: "Error",
      previewNotice:
        "Design prototype. Explore the character and contact screens. No messages are sent.",
      skip: "Skip to content",
      brandLabel: "Leszek Pawlak — character sheet",
      brandSubtitle: "CONSULTANT · YOUR ALLY",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      explore: "MEET YOUR NEXT ALLY",
      mainNavigation: "Main navigation",
      navCharacter: "Character sheet",
      navHome: "Home",
      navAbout: "Origin story",
      about: "About me",
      navServices: "Spellbook",
      services: "Services · preview",
      navExperience: "Adventure log",
      experience: "Experience",
      navWorkflow: "A shared quest",
      workflow: "Workflow",
      navContact: "Invite to your party",
      contact: "Contact",
      menuScope:
        "Story, experience and workflow show the proposed menu layout. Full screens follow in a later phase.",
      elsewhere: "BEYOND THE TAVERN",
      characterKicker: "AN ALLY FOR YOUR PARTY",
      professionalTitle: "TypeScript & React Consultant",
      portraitAlt:
        "Leszek Pawlak as a mage in a blue robe with a spellbook and staff",
      classLabel: "CHARACTER CLASS",
      className: "TypeScript Mage",
      classCaption: "Architecture. Code. Shared quests.",
      storyLine: "The best quests are a team effort.",
      heroDescription:
        "12+ years of hands-on experience in JavaScript ecosystems. I help teams make better architectural decisions, avoid costly mistakes, and ship faster.",
      years: "years of experience",
      specialty: "Architecture<br />and code quality",
      invite: "Invite to your party",
      help: "How I can help",
      estimateNote: "Let's talk about your project and a free estimate.",
      equipment: "TOOLS OF THE TRADE",
      contactKicker: "THE START OF A SHARED ADVENTURE",
      contactTitle: "Invite me<br />to your party.",
      contactDescription:
        "Have a technical challenge? Let's discuss how I can help your team.",
      formTitle: "A message to the mage",
      formDisclaimer: "Prototype mode — no data leaves this page.",
      nameLabel: "Full name",
      emailLabel: "Email",
      messageLabel: "Message",
      namePlaceholder: "What should I call you?",
      emailPlaceholder: "you@company.com",
      messagePlaceholder: "Tell me about the quest your team is facing…",
      send: "Send message",
      sending: "Sending…",
      requiredFields: "All fields are required.",
      statusSending: "Preview: sending your message…",
      statusSuccess:
        "Success preview: message sent. Nothing was sent by this prototype — this is a simulated response.",
      statusError:
        "Error preview: your message could not be sent. Please try again. Your input has been kept.",
      partySupport: "SUPPORT FOR YOUR PARTY",
      questTitle: "Your quest.<br />My experience.",
      serviceArchitecture: "Architecture Consulting",
      serviceEstimation: "Project Estimation & Planning",
      serviceAI: "AI Integration Strategy",
      ndaTitle: "Trust comes first.",
      ndaDescription:
        "The details of your project can wait until we have signed an NDA.",
      ndaDownload: "Download NDA PL/EN",
      footerLine: "Good solutions start with a conversation.",
      cookieBannerLabel: "Cookie banner preview",
      cookieMessage:
        "This site uses cookies to ensure you get the best experience. By continuing to browse, you agree to our use of cookies.",
      cookieDisclaimer:
        "Banner preview — this prototype does not store consent or run analytics.",
      accept: "Got it",
      servicesKicker: "SPELLBOOK · SERVICES",
      closeServices: "Close services preview",
      servicesTitle: "How I can help",
      autoSuffix: "automatic",
      serviceDetails: [
        [
          "Architecture Consulting",
          "Deep-dive reviews of your TypeScript/React architecture. I help identify bottlenecks, suggest scalable patterns, and guide your team toward maintainable solutions.",
        ],
        [
          "Project Estimation & Planning",
          "Realistic project estimation based on hands-on experience. From MVPs to complex systems — detailed requirements analysis, risk assessment, and roadmap planning.",
        ],
        [
          "Code Review & Mentoring",
          "Elevate your team's code quality. Thorough code reviews, best practices workshops, and hands-on mentoring in TypeScript, React, and Node.js.",
        ],
        [
          "AI Integration Strategy",
          "Practical guidance on integrating LLMs and AI services into your web applications. From feasibility assessment to production-ready implementation patterns.",
        ],
      ],
    },
  };

  const params = new URLSearchParams(window.location.search);
  const allowed = (key, values, fallback) =>
    values.includes(params.get(key)) ? params.get(key) : fallback;
  const state = {
    locale: allowed("lang", ["pl", "en"], "pl"),
    screen: allowed(
      "screen",
      ["character", "contact"],
      window.location.hash === "#contact" ? "contact" : "character",
    ),
    theme: allowed("theme", ["auto", "day", "evening", "night"], "auto"),
    width: allowed("width", ["responsive", "mobile"], "responsive"),
    form: "idle",
    cookies: params.get("cookies") !== "0",
    motion: true,
  };
  const root = document.documentElement;
  const world = document.getElementById("world");
  const form = document.getElementById("contact-form");
  const formState = document.getElementById("form-state");
  const servicesDialog = document.getElementById("services-dialog");
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const htmlKeys = new Set(["specialty", "contactTitle", "questTitle"]);
  let submitTimer;

  function getTimeOfDay(hour) {
    if (hour >= 6 && hour < 18) return "day";
    if (hour >= 18 && hour < 22) return "evening";
    return "night";
  }

  function updateUrl() {
    const next = new URL(window.location.href);
    for (const [key, value] of Object.entries({
      lang: state.locale,
      screen: state.screen,
      theme: state.theme,
      width: state.width,
      cookies: state.cookies ? "1" : "0",
    }))
      next.searchParams.set(key, value);
    next.hash = "";
    window.history.replaceState(null, "", next);
  }

  function updateTheme() {
    const time =
      state.theme === "auto"
        ? getTimeOfDay(new Date().getHours())
        : state.theme;
    root.dataset.time = time;
    document.getElementById("theme-picker").value = state.theme;
    document.getElementById("time-label").textContent =
      copy[state.locale][time] +
      (state.theme === "auto" ? " · " + copy[state.locale].autoSuffix : "");
    document
      .getElementById("time-icon")
      .setAttribute("href", time === "night" ? "#i-moon" : "#i-sun");
  }

  function updateMotion() {
    const enabled = state.motion && !motionPreference.matches;
    world.dataset.motion = enabled ? "on" : "off";
    const button = document.getElementById("motion-toggle");
    button.setAttribute("aria-pressed", String(enabled));
    button.disabled = motionPreference.matches;
    button.textContent =
      copy[state.locale][
        motionPreference.matches
          ? "motionReduced"
          : enabled
            ? "motionOn"
            : "motionOff"
      ];
  }

  function setMenu(open, returnFocus = false) {
    world.dataset.menuOpen = String(open);
    const toggle = document.getElementById("menu-toggle");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      copy[state.locale][open ? "closeMenu" : "openMenu"],
    );
    toggle
      .querySelector("use")
      .setAttribute("href", open ? "#i-close" : "#i-menu");
    if (returnFocus) toggle.focus();
  }

  function setScreen(screen, scroll = false) {
    state.screen = screen;
    document.getElementById("character-view").hidden = screen !== "character";
    document.getElementById("contact-view").hidden = screen !== "contact";
    document.getElementById("form-state-control").hidden = screen !== "contact";
    for (const link of document.querySelectorAll(".menu-item[data-screen]")) {
      if (link.dataset.screen === screen)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    setMenu(false);
    updateUrl();
    if (scroll) {
      const heading = document
        .getElementById(screen + "-view")
        .querySelector("h1");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      world.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  function setFormState(next) {
    state.form = next;
    formState.value = next;
    document.getElementById("send-button").disabled = next === "sending";
    document.getElementById("send-label").textContent =
      copy[state.locale][next === "sending" ? "sending" : "send"];
    form.setAttribute("aria-busy", String(next === "sending"));
    const status = document.getElementById("form-status");
    status.hidden = next === "idle";
    status.dataset.state = next;
    const key = {
      sending: "statusSending",
      success: "statusSuccess",
      error: "statusError",
    }[next];
    status.textContent = key ? copy[state.locale][key] : "";
  }

  function setCookies(visible) {
    state.cookies = visible;
    document.getElementById("cookie-banner").hidden = !visible;
    document
      .getElementById("cookie-toggle")
      .setAttribute("aria-pressed", String(visible));
    updateUrl();
  }

  function setWidth(width) {
    state.width = width;
    document.querySelector(".preview-stage").dataset.width = width;
    for (const button of document.querySelectorAll("button[data-width]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.width === width),
      );
    setMenu(false);
    updateUrl();
  }

  function translate() {
    root.lang = state.locale;
    const dictionary = copy[state.locale];
    for (const node of document.querySelectorAll("[data-i18n]")) {
      const key = node.dataset.i18n;
      if (htmlKeys.has(key)) node.innerHTML = dictionary[key];
      else node.textContent = dictionary[key];
    }
    for (const [attribute, target] of [
      ["data-i18n-aria", "aria-label"],
      ["data-i18n-alt", "alt"],
      ["data-i18n-placeholder", "placeholder"],
    ]) {
      for (const node of document.querySelectorAll("[" + attribute + "]"))
        node.setAttribute(target, dictionary[node.getAttribute(attribute)]);
    }
    for (const button of document.querySelectorAll("[data-locale]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.locale === state.locale),
      );
    const services = document.getElementById("services-content");
    services.replaceChildren();
    for (const [title, description] of dictionary.serviceDetails) {
      const article = document.createElement("article");
      const heading = document.createElement("h3");
      const paragraph = document.createElement("p");
      heading.textContent = title;
      paragraph.textContent = description;
      article.append(heading, paragraph);
      services.append(article);
    }
    document.title =
      "Leszek Pawlak — " +
      (state.locale === "pl" ? "makieta RPG" : "RPG prototype");
    updateTheme();
    updateMotion();
    setMenu(world.dataset.menuOpen === "true");
    setFormState(state.form);
    updateUrl();
  }

  for (const link of document.querySelectorAll("[data-screen]"))
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setScreen(link.dataset.screen, true);
    });
  for (const button of document.querySelectorAll("[data-locale]"))
    button.addEventListener("click", () => {
      state.locale = button.dataset.locale;
      translate();
    });
  for (const button of document.querySelectorAll("button[data-width]"))
    button.addEventListener("click", () => setWidth(button.dataset.width));
  document
    .getElementById("theme-picker")
    .addEventListener("change", (event) => {
      state.theme = event.target.value;
      updateTheme();
      updateUrl();
    });
  document
    .getElementById("menu-toggle")
    .addEventListener("click", () =>
      setMenu(world.dataset.menuOpen !== "true"),
    );
  document.getElementById("motion-toggle").addEventListener("click", () => {
    state.motion = !state.motion;
    updateMotion();
  });
  document
    .getElementById("cookie-toggle")
    .addEventListener("click", () => setCookies(!state.cookies));
  document
    .getElementById("cookie-accept")
    .addEventListener("click", () => setCookies(false));
  formState.addEventListener("change", (event) => {
    clearTimeout(submitTimer);
    setFormState(event.target.value);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.form === "sending") return;
    const outcome = state.form === "error" ? "error" : "success";
    setFormState("sending");
    clearTimeout(submitTimer);
    submitTimer = setTimeout(() => {
      if (outcome === "success") form.reset();
      setFormState(outcome);
    }, 900);
  });
  for (const trigger of document.querySelectorAll("[data-open-services]"))
    trigger.addEventListener("click", () => servicesDialog.showModal());
  document
    .getElementById("close-services")
    .addEventListener("click", () => servicesDialog.close());
  document.getElementById("services-contact").addEventListener("click", () => {
    servicesDialog.close();
    setScreen("contact", true);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (servicesDialog.open) {
      event.preventDefault();
      servicesDialog.close();
    } else if (world.dataset.menuOpen === "true") {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener("visibilitychange", () => {
    root.dataset.pageHidden = String(document.hidden);
    if (!document.hidden) updateTheme();
  });
  motionPreference.addEventListener("change", updateMotion);
  setInterval(() => {
    if (!document.hidden && state.theme === "auto") updateTheme();
  }, 60000);
  document.getElementById("year").textContent = String(
    new Date().getFullYear(),
  );
  translate();
  setScreen(state.screen);
  setWidth(state.width);
  setCookies(state.cookies);
})();
