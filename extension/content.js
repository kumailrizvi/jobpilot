/**
 * JobPilot AI content script.
 * Goal: autofill common application fields after user approval.
 * It does NOT bypass CAPTCHA, hidden fields, paywalls, or forced final submission.
 */

const FIELD_MAP = {
  fullName: [
    "input[name='name']",
    "input[name='full_name']",
    "input[name='fullName']",
    "input[id*='name' i]",
    "input[aria-label*='name' i]",
    "input[placeholder*='name' i]"
  ],
  firstName: [
    "input[name='first_name']",
    "input[name='firstName']",
    "input[id*='first' i]",
    "input[aria-label*='first' i]",
    "input[placeholder*='first' i]"
  ],
  lastName: [
    "input[name='last_name']",
    "input[name='lastName']",
    "input[id*='last' i]",
    "input[aria-label*='last' i]",
    "input[placeholder*='last' i]"
  ],
  email: [
    "input[type='email']",
    "input[name='email']",
    "input[id*='email' i]",
    "input[aria-label*='email' i]",
    "input[placeholder*='email' i]"
  ],
  phone: [
    "input[type='tel']",
    "input[name='phone']",
    "input[name*='phone' i]",
    "input[id*='phone' i]",
    "input[aria-label*='phone' i]",
    "input[placeholder*='phone' i]"
  ],
  linkedin: [
    "input[name*='linkedin' i]",
    "input[id*='linkedin' i]",
    "input[aria-label*='linkedin' i]",
    "input[placeholder*='linkedin' i]"
  ],
  website: [
    "input[name*='website' i]",
    "input[name*='portfolio' i]",
    "input[id*='website' i]",
    "input[id*='portfolio' i]",
    "input[aria-label*='website' i]",
    "input[placeholder*='website' i]"
  ],
  coverLetter: [
    "textarea[name*='cover' i]",
    "textarea[id*='cover' i]",
    "textarea[aria-label*='cover' i]",
    "textarea[placeholder*='cover' i]"
  ]
};

function setNativeValue(element, value) {
  if (!element || value === undefined || value === null || value === "") return false;
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor && descriptor.set) descriptor.set.call(element, value);
  else element.value = value;

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true }));
  return true;
}

function findOne(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && !el.disabled && !el.readOnly) return el;
  }
  return null;
}

function splitName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || ""
  };
}

function fillByLabel(labelText, value) {
  if (!value) return false;
  const labels = Array.from(document.querySelectorAll("label"));
  const label = labels.find(l => l.innerText.toLowerCase().includes(labelText.toLowerCase()));
  if (!label) return false;

  let input = null;
  if (label.htmlFor) input = document.getElementById(label.htmlFor);
  if (!input) input = label.querySelector("input, textarea, select");
  if (!input && label.parentElement) input = label.parentElement.querySelector("input, textarea, select");

  return setNativeValue(input, value);
}

function fillCommonQuestions(data) {
  const answers = data.answers || "";
  if (!answers) return;

  const textareas = Array.from(document.querySelectorAll("textarea"));
  for (const area of textareas) {
    const context = [
      area.name,
      area.id,
      area.placeholder,
      area.getAttribute("aria-label"),
      area.closest("label")?.innerText,
      area.parentElement?.innerText
    ].filter(Boolean).join(" ").toLowerCase();

    if (
      context.includes("why") ||
      context.includes("tell us") ||
      context.includes("additional") ||
      context.includes("anything else") ||
      context.includes("cover") ||
      context.includes("summary")
    ) {
      if (!area.value) setNativeValue(area, answers);
    }
  }
}

function platformHints() {
  const host = location.hostname;
  if (host.includes("greenhouse")) return "greenhouse";
  if (host.includes("lever")) return "lever";
  if (host.includes("ashby")) return "ashby";
  if (host.includes("workday")) return "workday";
  if (host.includes("dayforce")) return "dayforce";
  if (host.includes("linkedin")) return "linkedin";
  return "unknown";
}

function autofill(data) {
  const { firstName, lastName } = splitName(data.fullName);

  setNativeValue(findOne(FIELD_MAP.fullName), data.fullName);
  setNativeValue(findOne(FIELD_MAP.firstName), firstName);
  setNativeValue(findOne(FIELD_MAP.lastName), lastName);
  setNativeValue(findOne(FIELD_MAP.email), data.email);
  setNativeValue(findOne(FIELD_MAP.phone), data.phone);
  setNativeValue(findOne(FIELD_MAP.linkedin), data.linkedin);
  setNativeValue(findOne(FIELD_MAP.website), data.website);
  setNativeValue(findOne(FIELD_MAP.coverLetter), data.coverLetter);

  fillByLabel("Full name", data.fullName);
  fillByLabel("First name", firstName);
  fillByLabel("Last name", lastName);
  fillByLabel("Email", data.email);
  fillByLabel("Phone", data.phone);
  fillByLabel("LinkedIn", data.linkedin);
  fillByLabel("Portfolio", data.website);
  fillByLabel("Website", data.website);
  fillByLabel("Cover letter", data.coverLetter);

  fillCommonQuestions(data);

  const banner = document.createElement("div");
  banner.innerText = `JobPilot AI autofilled fields on ${platformHints()}. Review before submitting.`;
  banner.style.cssText = "position:fixed;z-index:2147483647;top:12px;right:12px;background:#0f172a;color:white;padding:12px 14px;border-radius:12px;font:13px Arial;box-shadow:0 8px 30px rgba(0,0,0,.18)";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 4500);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "JOBPILOT_FILL") {
    autofill(message.payload || {});
  }
});
