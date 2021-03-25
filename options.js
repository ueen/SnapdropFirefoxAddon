function saveOptions() {
  
  browser.storage.sync.set({
    SFAmode: document.querySelector("#modes").value
  });

  document.querySelector("#info").textContent = "saved";
  document.querySelector("#info").style.opacity = 0;
  document.querySelector("#info").addEventListener('transitionend', () => browser.runtime.sendMessage({mode: document.querySelector("#modes").value}));
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#modes").value = result.SFAmode || "popup"; //deault
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  let getting = browser.storage.sync.get(['SFAmode']);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#modes").addEventListener("change", saveOptions);