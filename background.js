let snapdrop;

browser.storage.sync.get(['SFAmode']).then(function (result) {
	switch (result.SFAmode) {
		case "back":
			snapdrop = new Snapdrop();
			browser.tabs.onUpdated.addListener(handleUpdated);
			browser.tabs.onRemoved.addListener(handleRemoved);
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
			browser.tabs.create({url:"https://snapdrop.net/"});
		} else {
			browser.tabs.update(tabs[0].id, {
			    active: true
			 });
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