// The invitation uses the same isolated, same-origin content bridge as W01.
// Personalised strings are always inserted as text, never HTML.
(() => {
  let started = false;
  const get = (id) => document.getElementById(id);
  const text = (id, value) => {
    get(id).textContent = String(value || "");
  };
  const safeImage = (value) => {
    if (typeof value !== "string") return "";
    if (/^\/images\/invitations\/[a-zA-Z0-9_.-]+$/.test(value)) return value;
    try {
      const url = new URL(value);
      if (
        url.protocol === "https:" &&
        url.hostname === "res.cloudinary.com" &&
        !url.username &&
        !url.password
      )
        return value;
    } catch {}
    return "";
  };
  function configure(config) {
    if (started || !config?.content) return;
    started = true;
    const c = config.content;
    const one = c.partnerOne || "ඔබේ නම";
    const two = c.partnerTwo || "ඔබේ සහකරුගේ නම";
    const names = `${one} සහ ${two}`;
    document.title = `${names} — මංගල ඇරයුම`;
    text("one", one);
    text("two", two);
    document.querySelectorAll("[data-names]").forEach((el) => {
      el.textContent = names;
    });
    if (config.guest) text("guest", String(config.guest).slice(0, 100));
    text("welcome", c.welcome);
    text("story", c.story);
    get("story-section").hidden = !c.story;
    text("venue", c.venue || "ස්ථානය තහවුරු කිරීමට නියමිතයි");
    text("address", c.address);
    const photo = safeImage(c.couplePhoto);
    get("photo").hidden = !photo;
    if (photo) {
      get("photo").src = photo;
      get("photo").alt = names;
    }
    const date = new Date(c.weddingAt);
    const validDate = Number.isFinite(date.getTime());
    // Some browsers lack Sinhala locale data and silently fall back to English.
    // Use explicit Sinhala labels with timezone-aware numeric parts everywhere.
    const parts = validDate
      ? new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
          hourCycle: "h23",
          timeZone: "Asia/Colombo",
        }).formatToParts(date)
      : [];
    const part = (key) =>
      parts.find((value) => value.type === key)?.value || "";
    const months = [
      "ජනවාරි",
      "පෙබරවාරි",
      "මාර්තු",
      "අප්‍රේල්",
      "මැයි",
      "ජූනි",
      "ජූලි",
      "අගෝස්තු",
      "සැප්තැම්බර්",
      "ඔක්තෝබර්",
      "නොවැම්බර්",
      "දෙසැම්බර්",
    ];
    const weekdays = {
      Sun: "ඉරිදා",
      Mon: "සඳුදා",
      Tue: "අඟහරුවාදා",
      Wed: "බදාදා",
      Thu: "බ්‍රහස්පතින්දා",
      Fri: "සිකුරාදා",
      Sat: "සෙනසුරාදා",
    };
    const dateText = validDate
      ? `${part("year")} ${months[Number(part("month")) - 1]} ${Number(part("day"))}, ${weekdays[part("weekday")]}`
      : "දිනය තහවුරු කිරීමට නියමිතයි";
    document.querySelectorAll("[data-date]").forEach((el) => {
      el.textContent = dateText;
    });
    text(
      "time",
      validDate
        ? `${Number(part("hour")) < 12 ? "පෙ.ව." : "ප.ව."} ${Number(part("hour")) % 12 || 12}:${part("minute")}`
        : "",
    );
    get("map").hidden = true;
    try {
      const map = new URL(c.mapUrl);
      if (
        map.protocol === "https:" &&
        !map.username &&
        !map.password &&
        [
          "maps.google.com",
          "www.google.com",
          "google.com",
          "maps.app.goo.gl",
          "goo.gl",
        ].includes(map.hostname)
      ) {
        get("map").href = map.href;
        get("map").hidden = false;
      }
    } catch {}
    const photos = Array.isArray(c.gallery)
      ? c.gallery.slice(0, 8).map(safeImage).filter(Boolean)
      : [];
    get("gallery").hidden = photos.length === 0;
    photos.forEach((src, i) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `අපේ සොඳුරු මතක ${i + 1}`;
      image.loading = "lazy";
      get("gallery").append(image);
    });
    const phone = String(c.rsvpPhone || "").replace(/\D/g, "");
    const preview = config.preview || config.demo;
    get("reply").hidden = preview || !/^[1-9]\d{6,14}$/.test(phone);
    if (!get("reply").hidden)
      get("reply").href =
        `https://wa.me/${phone}?text=${encodeURIComponent(`${names}, ඔබගේ මංගල දිනයට මාගේ පැමිණීම පිළිබඳව දැනුම් දීමට කැමැත්තෙමි.`)}`;
    text(
      "reply-note",
      preview
        ? "මෙය පෙරදසුනකි. මෙහිදී පැමිණීම තහවුරු කළ නොහැක."
        : get("reply").hidden
          ? "පැමිණීම දැනුම් දීමට මනාල යුවළ අමතන්න."
          : "ඔබේ පැමිණීම තහවුරු කිරීමට WhatsApp තුළ පණිවිඩය සකසා යවන්න.",
    );
    get("mode").hidden = !preview;
    text(
      "mode",
      config.demo
        ? "W02 · ආදර්ශ ආරාධනාවකි"
        : "පුද්ගලික පෙරදසුනකි · ප්‍රකාශිත ආරාධනාව නොවේ",
    );
    get("open").addEventListener("click", () => {
      get("cover").hidden = true;
      get("invitation").hidden = false;
      window.scrollTo(0, 0);
      get("names").tabIndex = -1;
      get("names").focus({ preventScroll: true });
    });
    get("print").addEventListener("click", () => window.print());
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((date.getTime() - Date.now()) / 1000),
      );
      get("countdown").hidden = !validDate || remaining === 0;
      if (!validDate) return;
      if (remaining === 0) {
        text("countdown-note", "අපේ සතුට බෙදා ගන්නා ඔබට ස්තුතියි.");
        return;
      }
      text("days", Math.floor(remaining / 86400));
      text("hours", Math.floor(remaining / 3600) % 24);
      text("minutes", Math.floor(remaining / 60) % 60);
      text("seconds", remaining % 60);
    };
    tick();
    if (validDate && date.getTime() > Date.now()) {
      const timer = setInterval(tick, 1000);
      window.addEventListener("pagehide", () => clearInterval(timer), {
        once: true,
      });
    }
    get("loading").hidden = true;
    get("experience").hidden = false;
    document.body.dataset.invitationReady = "true";
  }
  window.addEventListener("message", (event) => {
    if (
      event.source !== parent ||
      event.origin !== location.origin ||
      event.data?.type !== "nakathata:invitation-content"
    )
      return;
    configure(event.data);
  });
  parent.postMessage({ type: "nakathata:invitation-ready" }, location.origin);
})();
