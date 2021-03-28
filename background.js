let snapdrop;

let sdURL = "https://snapdrop.net/";

var winPop = false;

// Temporary chrome support polyfill
if(!browser) {
var browser = chrome;
}
browser.storage.sync.get(['SFAmode','Winpop']).then(function (result) {
	switch (result.SFAmode) {
		case "back":
			snapdrop = new Snapdrop();
			browser.tabs.onUpdated.addListener(handleUpdated);
			browser.tabs.onRemoved.addListener(handleRemoved);
			winPop = result.Winpop || false;
			break;
		default: //popup
			browser.browserAction.setPopup({popup: 'popup/popup.html'});
			break;
	}
});

browser.browserAction.onClicked.addListener(browserActionClick);
browser.runtime.onMessage.addListener(_ => browser.runtime.reload());

function browserActionClick() { //only in background mode
	browser.tabs.query({url: "*://*.snapdrop.net/*"}).then( tabs => {
		if (tabs.length <= 0) {
			if (winPop) {
				browser.windows.create({
				    url: sdURL,
				    type: "popup",
				    height: 480,
				    width: 360
				  });
			} else {
				browser.tabs.create({url: sdURL});
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
	snapdrop.server.restart();
  	console.log('background snapdrop restarted');
}
function stop() {
	snapdrop.server.stop(); 
  	console.log('background snapdrop stopped'); 
}
