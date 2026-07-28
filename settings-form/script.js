const STORAGE_KEY = "flyrank-settings";
const DEFAULT_SETTINGS = {
  displayName: "",
  email: "",
  timezone: "UTC",
  emailNotifications: true,
  productUpdates: false,
  weeklyDigest: true,
  theme: "light",
  language: "en",
  publicProfile: false,
  showActivity: true,
};

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("form-status");
const resetBtn = document.getElementById("reset-btn");

function getSettingsFromForm() {
  const formData = new FormData(form);

  return {
    displayName: formData.get("displayName").trim(),
    email: formData.get("email").trim(),
    timezone: formData.get("timezone"),
    emailNotifications: formData.get("emailNotifications") === "on",
    productUpdates: formData.get("productUpdates") === "on",
    weeklyDigest: formData.get("weeklyDigest") === "on",
    theme: formData.get("theme"),
    language: formData.get("language"),
    publicProfile: formData.get("publicProfile") === "on",
    showActivity: formData.get("showActivity") === "on",
  };
}

function applySettingsToForm(settings) {
  form.displayName.value = settings.displayName;
  form.email.value = settings.email;
  form.timezone.value = settings.timezone;
  form.emailNotifications.checked = settings.emailNotifications;
  form.productUpdates.checked = settings.productUpdates;
  form.weeklyDigest.checked = settings.weeklyDigest;
  form.language.value = settings.language;
  form.publicProfile.checked = settings.publicProfile;
  form.showActivity.checked = settings.showActivity;

  const themeInput = form.querySelector(`input[name="theme"][value="${settings.theme}"]`);
  if (themeInput) {
    themeInput.checked = true;
  }

  applyTheme(settings.theme);
}

function applyTheme(theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      applySettingsToForm(DEFAULT_SETTINGS);
      return;
    }

    const parsed = JSON.parse(saved);
    applySettingsToForm({ ...DEFAULT_SETTINGS, ...parsed });
  } catch {
    applySettingsToForm(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);

  if (message) {
    window.setTimeout(() => {
      statusEl.textContent = "";
      statusEl.classList.remove("error");
    }, 3000);
  }
}

function clearFieldErrors() {
  form.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  form.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}

function validateSettings(settings) {
  clearFieldErrors();
  let isValid = true;

  if (!settings.displayName) {
    setFieldError("displayName", "Display name is required.");
    isValid = false;
  }

  if (!settings.email) {
    setFieldError("email", "Email is required.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    setFieldError("email", "Enter a valid email address.");
    isValid = false;
  }

  return isValid;
}

function setFieldError(fieldName, message) {
  const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
  const inputEl = form.elements[fieldName];

  if (errorEl) {
    errorEl.textContent = message;
  }

  if (inputEl) {
    inputEl.classList.add("invalid");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const settings = getSettingsFromForm();

  if (!validateSettings(settings)) {
    showStatus("Please fix the errors before saving.", true);
    return;
  }

  saveSettings(settings);
  applyTheme(settings.theme);
  showStatus("Settings saved successfully.");
});

form.addEventListener("change", (event) => {
  if (event.target.name === "theme") {
    applyTheme(event.target.value);
  }
});

resetBtn.addEventListener("click", () => {
  applySettingsToForm(DEFAULT_SETTINGS);
  localStorage.removeItem(STORAGE_KEY);
  showStatus("Settings reset to defaults.");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const theme = form.querySelector('input[name="theme"]:checked')?.value || "light";
  if (theme === "system") {
    applyTheme("system");
  }
});

loadSettings();
