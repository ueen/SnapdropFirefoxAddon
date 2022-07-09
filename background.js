let snapdrop;

let sdURL = "https://snapdrop.net";

const popupModes = {
  Winpop: 'winpop',
  Tab: 'tab',
  Sidebar: 'sidebar'
}

let popupMode;

browser.storage.sync.get({SdAmode:"", Backg:false, Servr:"https://snapdrop.net"}).then(function (result) {
	sdURL = result.Servr;

	popupMode = result.SdAmode;
	switch (result.SdAmode) {
		case popupModes.Sidebar:
			popupListener();
			sidebarInit();
		case popupModes.Winpop:
		case popupModes.Tab:
			browser.browserAction.onClicked.addListener(browserActionClick);
			break;
		default: //classic popup
			browser.browserAction.setPopup({popup: 'popup/popup.html'});
			popupListener();
			break;
	}

	if (result.Backg) {
		snapdrop = new Snapdrop(sdURL.split("//")[1]);
		browser.tabs.onUpdated.addListener(handleUpdated);
		browser.tabs.onRemoved.addListener(handleRemoved);
	}
});

browser.runtime.onMessage.addListener(action => {
	switch (action) {
		case "reload":
			browser.runtime.reload();
			break;
		case "sidebarClick":
			sidebarListener();
			break;
	}
});

function popupListener() {
	browser.runtime.onConnect.addListener(function(port) {
				if (port.name === "popup") {
					stop();
					port.onDisconnect.addListener(_ => restart());
				}
			});
}

function sidebarListener() {
	browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message === "sidebarClick") {
			browser.tabs.query({active: true}).then(tabs => {
				sendResponse(tabs[0].url);
			});
		}
		return true;
	});
}

function sidebarInit() {
	try {
  	browser.contentScripts.register({
		    matches: [sdURL+'/*'],
		    js: [{file: "browser-polyfill.js"}, {file: "popup/sidebar.js"}],
		    allFrames : true,
		    runAt: "document_idle"
		  });
	} catch (error) {
	  console.log(error);
	}
}


function browserActionClick() { //only if not 'classic' Popup Mode
	if (popupMode == popupModes.Sidebar) {
		browser.sidebarAction.open(); //requieres direct user input handle
	} else {
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
					case popupModes.Sidebar:
						
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
