const fields = ["fullName", "email", "phone", "linkedin", "website", "coverLetter", "answers"];

async function load() {
  const saved = await chrome.storage.local.get(fields);
  for (const field of fields) {
    document.getElementById(field).value = saved[field] || "";
  }
}

async function save() {
  const payload = {};
  for (const field of fields) payload[field] = document.getElementById(field).value;
  await chrome.storage.local.set(payload);
  document.getElementById("status").innerText = "Saved.";
}

async function fillCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await chrome.storage.local.get(fields);
  await chrome.tabs.sendMessage(tab.id, { type: "JOBPILOT_FILL", payload: data });
  document.getElementById("status").innerText = "Autofill attempted. Review before submitting.";
}

document.getElementById("save").addEventListener("click", save);
document.getElementById("fill").addEventListener("click", fillCurrentPage);
load();
