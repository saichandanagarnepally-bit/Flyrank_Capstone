/**
 * Settings Form — Client-side validation
 * Validates required fields, email format, password length,
 * and confirm-password match before allowing submission.
 */

(function () {
  "use strict";

  // DOM references
  const form = document.getElementById("settings-form");
  const formStatus = document.getElementById("form-status");

  const fields = {
    fullName: {
      input: document.getElementById("full-name"),
      errorEl: document.getElementById("full-name-error"),
    },
    email: {
      input: document.getElementById("email"),
      errorEl: document.getElementById("email-error"),
    },
    password: {
      input: document.getElementById("password"),
      errorEl: document.getElementById("password-error"),
    },
    confirmPassword: {
      input: document.getElementById("confirm-password"),
      errorEl: document.getElementById("confirm-password-error"),
    },
  };

  // Standard email pattern — requires local part, @, and domain with a dot
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Trim whitespace from a field value.
   * @param {HTMLInputElement} input
   * @returns {string}
   */
  function getValue(input) {
    return input.value.trim();
  }

  /**
   * Show or clear an error message for a single field.
   * @param {object} field - Field config with input and errorEl
   * @param {string} message - Error text; empty string clears the error
   */
  function setFieldError(field, message) {
    field.errorEl.textContent = message;
    field.input.classList.toggle("input-error", message.length > 0);
    field.input.setAttribute("aria-invalid", message.length > 0 ? "true" : "false");
  }

  /**
   * Validate Full Name — must not be empty after trimming.
   * @param {string} value
   * @returns {string} Error message or empty string if valid
   */
  function validateFullName(value) {
    if (value === "") {
      return "Full name is required.";
    }
    return "";
  }

  /**
   * Validate Email — required and must match a valid format.
   * @param {string} value
   * @returns {string}
   */
  function validateEmail(value) {
    if (value === "") {
      return "Email is required.";
    }
    if (!EMAIL_PATTERN.test(value)) {
      return "Please enter a valid email address.";
    }
    return "";
  }

  /**
   * Validate Password — required and at least 8 characters.
   * @param {string} value
   * @returns {string}
   */
  function validatePassword(value) {
    if (value === "") {
      return "Password is required.";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    return "";
  }

  /**
   * Validate Confirm Password — required and must match password.
   * @param {string} value
   * @param {string} passwordValue
   * @returns {string}
   */
  function validateConfirmPassword(value, passwordValue) {
    if (value === "") {
      return "Please confirm your password.";
    }
    if (value !== passwordValue) {
      return "Passwords do not match.";
    }
    return "";
  }

  /**
   * Run validation for a single field and update its UI.
   * @param {string} fieldKey - Key in the fields object
   * @returns {boolean} True if the field is valid
   */
  function validateSingleField(fieldKey) {
    const passwordValue = getValue(fields.password.input);
    let message = "";

    switch (fieldKey) {
      case "fullName":
        message = validateFullName(getValue(fields.fullName.input));
        break;
      case "email":
        message = validateEmail(getValue(fields.email.input));
        break;
      case "password":
        message = validatePassword(getValue(fields.password.input));
        break;
      case "confirmPassword":
        message = validateConfirmPassword(
          getValue(fields.confirmPassword.input),
          passwordValue
        );
        break;
    }

    setFieldError(fields[fieldKey], message);
    return message === "";
  }

  /**
   * Validate every field in the form.
   * @returns {boolean} True if all fields pass validation
   */
  function validateForm() {
    const results = [
      validateSingleField("fullName"),
      validateSingleField("email"),
      validateSingleField("password"),
      validateSingleField("confirmPassword"),
    ];

    return results.every(Boolean);
  }

  /**
   * Focus the first field that has a validation error.
   */
  function focusFirstError() {
    const fieldOrder = ["fullName", "email", "password", "confirmPassword"];

    for (const key of fieldOrder) {
      if (fields[key].input.classList.contains("input-error")) {
        fields[key].input.focus();
        break;
      }
    }
  }

  /**
   * Clear the global form status message.
   */
  function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("success");
  }

  // --- Event Listeners ---

  // Validate individual fields on blur for immediate feedback
  Object.keys(fields).forEach(function (fieldKey) {
    fields[fieldKey].input.addEventListener("blur", function () {
      validateSingleField(fieldKey);

      // Re-check confirm password when password changes and confirm has a value
      if (
        fieldKey === "password" &&
        getValue(fields.confirmPassword.input) !== ""
      ) {
        validateSingleField("confirmPassword");
      }
    });

    // Clear error styling as the user types in a previously invalid field
    fields[fieldKey].input.addEventListener("input", function () {
      if (fields[fieldKey].input.classList.contains("input-error")) {
        validateSingleField(fieldKey);
      }
      clearFormStatus();
    });
  });

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormStatus();

    if (!validateForm()) {
      focusFirstError();
      return;
    }

    // All validations passed — simulate a successful save
    formStatus.textContent = "Settings saved successfully!";
    formStatus.classList.add("success");
    form.reset();

    // Reset aria-invalid on all inputs after successful save
    Object.keys(fields).forEach(function (fieldKey) {
      setFieldError(fields[fieldKey], "");
    });
  });
})();
