const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".nav-overlay");
const tabButtons = document.querySelectorAll(".tabs__btn");
const tabPanels = document.querySelectorAll(".tabs__panel");

const serviceSelect = document.getElementById("serviceSelect");
const currentYear = document.querySelector(".currentYear");

function toggleMenu(open) {
  burger.classList.toggle("is-active", open);
  nav.classList.toggle("is-open", open);
  overlay.classList.toggle("is-visible", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
}

burger.addEventListener("click", () => {
  const isOpen = nav.classList.contains("is-open");
  toggleMenu(!isOpen);
});

overlay.addEventListener("click", () => toggleMenu(false));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleMenu(false);
});

document.querySelectorAll(".nav__link__item").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("aria-controls");

    tabButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
      b.setAttribute("tabindex", "-1");
    });

    tabPanels.forEach((panel) => {
      panel.classList.remove("is-active");
      panel.hidden = true;
    });

    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    btn.setAttribute("tabindex", "0");

    const targetPanel = document.getElementById(targetId);
    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
  });

  btn.addEventListener("keydown", (e) => {
    const buttons = Array.from(tabButtons);
    const index = buttons.indexOf(btn);

    if (e.key === "ArrowRight") {
      const next = buttons[(index + 1) % buttons.length];
      next.focus();
      next.click();
    }
    if (e.key === "ArrowLeft") {
      const prev = buttons[(index - 1 + buttons.length) % buttons.length];
      prev.focus();
      prev.click();
    }
  });
});

if (serviceSelect) {
  const trigger = serviceSelect.querySelector(".select__trigger");
  const valueEl = serviceSelect.querySelector(".select__value");
  const options = Array.from(serviceSelect.querySelectorAll(".select__option"));
  const hiddenInput = document.getElementById("serviceInput");

  let activeIndex = -1;

  function openDropdown() {
    serviceSelect.classList.add("is-open");
  }

  function closeDropdown() {
    serviceSelect.classList.remove("is-open");
    activeIndex = -1;
    options.forEach((o) => o.classList.remove("is-active"));
  }

  function toggleDropdown() {
    serviceSelect.classList.contains("is-open")
      ? closeDropdown()
      : openDropdown();
  }

  function selectOption(option) {
    options.forEach((o) => o.classList.remove("is-selected"));
    option.classList.add("is-selected");

    valueEl.textContent = option.textContent;
    valueEl.classList.remove("is-placeholder");
    hiddenInput.value = option.dataset.value;

    closeDropdown();
  }

  trigger.addEventListener("click", toggleDropdown);

  options.forEach((option, i) => {
    option.addEventListener("click", () => selectOption(option));
    option.addEventListener("mouseenter", () => {
      activeIndex = i;
      options.forEach((o) => o.classList.remove("is-active"));
      option.classList.add("is-active");
    });
  });

  serviceSelect.addEventListener("keydown", (e) => {
    const isOpen = serviceSelect.classList.contains("is-open");

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0) {
        selectOption(options[activeIndex]);
      } else {
        openDropdown();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) openDropdown();
      activeIndex = Math.min(activeIndex + 1, options.length - 1);
      options.forEach((o) => o.classList.remove("is-active"));
      options[activeIndex].classList.add("is-active");
      options[activeIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) openDropdown();
      activeIndex = Math.max(activeIndex - 1, 0);
      options.forEach((o) => o.classList.remove("is-active"));
      options[activeIndex].classList.add("is-active");
      options[activeIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  });

  document.addEventListener("click", (e) => {
    if (!serviceSelect.contains(e.target)) closeDropdown();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  new Splide(".about__slider", {
    type: "loop",
    autoplay: true,
    interval: 4000,
    arrows: true,
    pagination: false,
    breakpoints: {
      950: {
        arrows: false,
        pagination: true,
      },
    },
  }).mount();
});

currentYear.textContent = new Date().getFullYear();

AOS.init();
