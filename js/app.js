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
