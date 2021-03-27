function saveOptions() {
  
  browser.storage.sync.set({
    SFAmode: document.querySelector("#modes").value,
    Winpop: document.querySelector("#winpop").checked
  });

  updateWinPop();

  document.querySelector("#info").textContent = "saved";
  document.querySelector("#info").style.opacity = 0;
  document.querySelector("#info").addEventListener('transitionend', () => browser.runtime.sendMessage({mode: document.querySelector("#modes").value}));
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#modes").value = result.SFAmode || "popup"; //deault
    document.querySelector("#winpop").checked = result.Winpop || false;
    updateWinPop();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  let getting = browser.storage.sync.get(['SFAmode','Winpop']);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#modes").addEventListener("change", saveOptions);
document.querySelector("#winpop").addEventListener("change", saveOptions);

function updateWinPop () {
  if (document.querySelector("#modes").value == "back") {
      document.querySelector("#winpop").style.display = 'inline';
      document.querySelector("#winpoplabel").style.display = 'inline';
    } else {
      document.querySelector("#winpop").style.display = 'none';
      document.querySelector("#winpoplabel").style.display = 'none';
    }

}