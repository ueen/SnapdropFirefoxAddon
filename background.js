let snapdrop;

let sdURL = "https://snapdrop.net";

const popupModes = {
  Winpop: 'winpop',
  Tab: 'tab'
}

let popupMode;

browser.storage.sync.get({SdAmode:"", Backg:false, Servr:"https://snapdrop.net"}).then(function (result) {
	switch (result.SdAmode) {
		case "winpop":
		case "tab":
			popupMode = result.SdAmode;
			break;
		default: //classic popup
			browser.browserAction.setPopup({popup: 'popup/popup.html'});
			browser.runtime.onConnect.addListener(function(port) {
				if (port.name === "popup") {
					stop();
					port.onDisconnect.addListener(_ => restart());
				}
			});
			break;
	}

	sdURL = result.Servr;

	if (result.Backg) {
		snapdrop = new Snapdrop(result.Servr);
		browser.tabs.onUpdated.addListener(handleUpdated);
		browser.tabs.onRemoved.addListener(handleRemoved);
	}
});

browser.browserAction.onClicked.addListener(browserActionClick);
browser.runtime.onMessage.addListener(_ => {
	browser.runtime.reload();
});

function browserActionClick() { //only if not 'classic' Popup Mode
	browser.tabs.query({url: "*://*."+sdURL.split("//")[1]+"/*"}).then( tabs => {
		if (tabs.length <= 0) {
			switch (popupMode) {
				case popupModes.Winpop:
					browser.windows.create({
					    url: sdURL,
					    type: "popup",
					    height: 480,
					    width: 360
					});
					break;
				case popupModes.Tab:
					browser.tabs.create({url: sdURL});
					break;
			}
		} else {
			browser.tabs.update(tabs[0].id, {
			    active: true
			 });
			browser.windows.update(tabs[0].windowId, {focused:true})
		}
	});
}


//handle snapdrop opened in tab 
var sdTab;

function handleUpdated(tabId, changeInfo, tabInfo) {
  if (tabInfo.url.includes(sdURL.split("//")[1])) {
  		stop();
  		sdTab = tabId;
  } else if (tabId == sdTab) {
  		restart();
  }
}

function handleRemoved(tabId, removeInfo) {
  if (sdTab && tabId == sdTab) {
  		restart();
  }
}

function restart() {
	if (snapdrop) {
		snapdrop.server.restart();
  		console.log('background snapdrop restarted');
	}
}
function stop() {
	if (snapdrop) {
		snapdrop.server.stop(); 
	  	console.log('background snapdrop stopped'); 
	}
}