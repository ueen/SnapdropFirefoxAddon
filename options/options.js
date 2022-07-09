function saveOptions() {
  
  browser.storage.sync.set({
    SdAmode: document.querySelector("#modes").value,
    Backg: document.querySelector("#backg").checked,
    Servr: document.querySelector("#servr").value
  });

  document.querySelector("#saveStateOut").textContent = "saved";
  document.querySelector("#saveStateOut").style.opacity = 0;
  document.querySelector("#saveStateOut").addEventListener('transitionend', () => {
    browser.runtime.sendMessage("reload");
    //for chromes floating options
    if (window.chrome) {
      window.close();
    }
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#modes").value = result.SdAmode;
    document.querySelector("#backg").checked = result.Backg;
    document.querySelector("#servr").value = result.Servr;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  let getting = browser.storage.sync.get({SdAmode:"popup", Backg:false, Servr:"https://snapdrop.net"});
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#modes").addEventListener("change", saveOptions);
document.querySelector("#backg").addEventListener("change", saveOptions);
document.querySelector("#servrsave").addEventListener("click", saveOptions);
document.querySelector("#servrreset").addEventListener("click", function () {
  document.querySelector("#servr").value = "https://snapdrop.net";
  saveOptions();
});