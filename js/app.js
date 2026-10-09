const root = document.documentElement;
const themeInputs = document.querySelectorAll(".theme-switcher__input");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("plantarium-theme", theme);
  themeInputs.forEach((input) => {
    input.checked = input.value === theme;
  });
}

themeInputs.forEach((input) => {
  input.addEventListener("change", () => setTheme(input.value));
});

setTheme(localStorage.getItem("plantarium-theme") ?? "dark");

const slider = document.querySelector("#comingSlider");
const viewport = slider?.querySelector(".coming-viewport");
const slides = viewport ? [...viewport.querySelectorAll("img")] : [];
const dotsRoot = document.querySelector("#comingDots");
const galleryRoot = document.querySelector("#comingGallery");
const prevBtn = slider?.querySelector(".coming-nav--prev");
const nextBtn = slider?.querySelector(".coming-nav--next");

let slideIndex = 0;
let pinned = false;
let sliderTimer = null;

function renderChrome() {
  if (dotsRoot) {
    dotsRoot.innerHTML = slides
      .map(
        (_, i) =>
          `<button type="button" class="coming-dot${i === slideIndex ? " is-active" : ""}" aria-label="Ir a la captura ${i + 1}"></button>`
      )
      .join("");
    [...dotsRoot.children].forEach((dot, i) => {
      dot.addEventListener("click", () => selectSlide(i, true));
    });
  }

  if (galleryRoot && galleryRoot.childElementCount === 0) {
    slides.forEach((img, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "coming-thumb";
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-label", img.alt || `Captura ${i + 1}`);
      const thumb = document.createElement("img");
      thumb.src = img.src;
      thumb.alt = "";
      button.append(thumb);
      button.addEventListener("click", () => {
        if (pinned && slideIndex === i) {
          pinned = false;
          startSlider();
          syncChrome();
          return;
        }
        selectSlide(i, true);
      });
      galleryRoot.append(button);
    });
  }
}

function syncChrome() {
  slides.forEach((img, i) => img.classList.toggle("is-active", i === slideIndex));
  if (dotsRoot) {
    [...dotsRoot.children].forEach((dot, i) => dot.classList.toggle("is-active", i === slideIndex));
  }
  if (galleryRoot) {
    [...galleryRoot.children].forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === slideIndex);
      thumb.classList.toggle("is-pinned", pinned && i === slideIndex);
    });
  }
  slider?.classList.toggle("is-pinned", pinned);
}

function selectSlide(index, pin) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  if (pin) {
    pinned = true;
    stopSlider();
  }
  syncChrome();
}

function nextSlide(step) {
  selectSlide(slideIndex + step, pinned);
}

function stopSlider() {
  if (sliderTimer) {
    window.clearInterval(sliderTimer);
    sliderTimer = null;
  }
}

function startSlider() {
  stopSlider();
  if (pinned || slides.length < 2) return;
  sliderTimer = window.setInterval(() => {
    if (!pinned) selectSlide(slideIndex + 1, false);
  }, 5000);
}

if (slides.length) {
  renderChrome();
  syncChrome();
  prevBtn?.addEventListener("click", () => nextSlide(-1));
  nextBtn?.addEventListener("click", () => nextSlide(1));
  startSlider();
}
