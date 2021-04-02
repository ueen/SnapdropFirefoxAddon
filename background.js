let snapdrop;

let sdURL = "https://snapdrop.net/";

const popupModes = {
  Winpop: 'winpop',
  Tab: 'tab'
}

let popupMode;

browser.storage.sync.get(['SdAmode','Backg']).then(function (result) {
	switch (result.SdAmode) {
		case "winpop":
		case "tab":
			popupMode = result.SdAmode;
			break;
		default: //classic popup
			browser.browserAction.setPopup({popup: 'popup/popup.html'});
			break;
	}

	if (result.Backg || false) {
		snapdrop = new Snapdrop();
		browser.tabs.onUpdated.addListener(handleUpdated);
		browser.tabs.onRemoved.addListener(handleRemoved);
	}
});

browser.browserAction.onClicked.addListener(browserActionClick);
browser.runtime.onMessage.addListener(message => {
	switch (message.action) {
		case "reload":
			browser.runtime.reload();
			break;
		case "stop":
			stop();
			break;
		case "restart":
			restart();
			break;
	}
	
});

function browserActionClick() { //only if not 'classic' Popup Mode
	browser.tabs.query({url: "*://*.snapdrop.net/*"}).then( tabs => {
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
  if (tabInfo.url.includes('snapdrop.net')) {
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
