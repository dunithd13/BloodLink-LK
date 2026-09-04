// BloodLink LK - Authentication & Validation Utilities

/**
 * Computes SHA-256 hash of a plain text string using the browser's native Web Crypto API.
 * Never stores plain text passwords.
 */
export async function hashPassword(plainText) {
  if (!plainText) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error("Web Crypto API is not supported in this environment.");
  }
  const hashBuffer = await cryptoObj.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates strong password rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export function validateStrongPassword(password) {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      message: "Password is required."
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must contain at least 8 characters."
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter."
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter."
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number."
    };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (e.g. !@#$%^&*)."
    };
  }

  return { isValid: true, message: "" };
}

/**
 * Validates standard email address format.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, message: "Email is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Please enter a valid email address." };
  }
  return { isValid: true, message: "" };
}

/**
 * Validates Sri Lankan phone number format:
 * - 07XXXXXXXX (10 digits)
 * - +947XXXXXXXX
 * - or landlines (e.g. 011XXXXXXX)
 */
export function validateSriLankanPhone(phone) {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: "Contact number is required." };
  }
  const cleaned = phone.replace(/[\s-]/g, "");
  const slPhoneRegex = /^(?:(?:\+94|0094|0)?7[0-9]{8}|(?:\+94|0094|0)[1-9][0-9]{8})$/;
  if (!slPhoneRegex.test(cleaned)) {
    return {
      isValid: false,
      message: "Please enter a valid Sri Lankan phone number (e.g. 0771234567 or +94712345678)."
    };
  }
  return { isValid: true, message: "" };
}
