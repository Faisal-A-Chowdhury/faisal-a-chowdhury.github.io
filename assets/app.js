(() => {
  "use strict";

  const root = document.documentElement;
  const themeSelect = document.querySelector("#theme-select");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function resolveTheme(preference) {
    return preference === "auto" ? (systemTheme.matches ? "dark" : "light") : preference;
  }

  function applyTheme(preference, save = true) {
    const allowed = ["auto", "light", "dark"];
    const selected = allowed.includes(preference) ? preference : "auto";
    const resolved = resolveTheme(selected);
    root.dataset.theme = selected;
    root.dataset.resolvedTheme = resolved;
    themeSelect.value = selected;
    themeColor.content = resolved === "dark" ? "#171513" : "#f2e9dc";
    if (save) {
      try { localStorage.setItem("faisal-theme", selected); } catch { /* Theme persistence is optional. */ }
    }
  }

  let savedTheme = "auto";
  try { savedTheme = localStorage.getItem("faisal-theme") || "auto"; } catch { /* Use auto. */ }
  applyTheme(savedTheme, false);
  themeSelect.addEventListener("change", event => applyTheme(event.target.value));
  systemTheme.addEventListener("change", () => {
    if (root.dataset.theme === "auto") applyTheme("auto", false);
  });

  const menuButton = document.querySelector("#menu-button");
  const navigation = document.querySelector("#site-nav");

  function setMenu(open) {
    navigation.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  }

  menuButton.addEventListener("click", () => setMenu(!navigation.classList.contains("open")));
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".header-inner")) setMenu(false);
  });

  function updateTime() {
    const centralTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date());
    document.querySelector("#central-time").textContent = `${centralTime} CT`;
  }

  updateTime();
  window.setInterval(updateTime, 30000);
  document.querySelector("#year").textContent = new Date().getFullYear();

  const toast = document.querySelector("#toast");
  let toastTimer;
  document.querySelector("#copy-email").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("fchowdhury5@lamar.edu");
      toast.textContent = "Email copied";
    } catch {
      toast.textContent = "fchowdhury5@lamar.edu";
    }
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
})();
