const DEFAULT_CONFIG = {
  params: [{ key: "enableRollbacks", value: "true" }],
  hosts: [
    { pattern: "*.csnonprod.com", routing: "hash" },
    { pattern: "*.contentstack.com", routing: "hash" },
    { pattern: "localhost", routing: "path" }
  ]
};

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const chipsContainer = document.getElementById("params-chips");

function updateStatus(enabled) {
  status.textContent = enabled ? "Active — params will be appended" : "Disabled — no changes to URLs";
  status.className = enabled ? "status active" : "status";
}

function renderChips(params) {
  chipsContainer.innerHTML = "";
  if (!params.length) {
    chipsContainer.innerHTML = '<span style="color:#555;font-size:12px">No params configured</span>';
    return;
  }
  params.forEach((p) => {
    const chip = document.createElement("span");
    chip.className = "param-chip";
    chip.textContent = `${p.key}=${p.value}`;
    chipsContainer.appendChild(chip);
  });
}

// Load saved state
chrome.storage.local.get({ enabled: true, config: DEFAULT_CONFIG }, (data) => {
  toggle.checked = data.enabled;
  updateStatus(data.enabled);
  renderChips(data.config.params);
});

// Save on toggle
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled }, () => {
    updateStatus(enabled);
  });
});

// Open settings page
document.getElementById("open-settings").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
