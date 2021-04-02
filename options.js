function saveOptions() {
  
  browser.storage.sync.set({
    SdAmode: document.querySelector("#modes").value,
    Backg: document.querySelector("#backg").checked
  });

  document.querySelector("#saveStateOut").textContent = "saved";
  document.querySelector("#saveStateOut").style.opacity = 0;
  document.querySelector("#saveStateOut").addEventListener('transitionend', () => browser.runtime.sendMessage({action: "reload"}));
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#modes").value = result.SdAmode || "popup"; //deault
    document.querySelector("#backg").checked = result.Backg || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  let getting = browser.storage.sync.get(['SdAmode','Backg']);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#modes").addEventListener("change", saveOptions);
document.querySelector("#backg").addEventListener("change", saveOptions);
