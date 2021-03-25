function browserActionClick() {
  browser.runtime.reload()
}

browser.browserAction.onClicked.addListener(browserActionClick);
browser.runtime.onMessage.addListener(browserActionClick);

browser.storage.sync.get(['SFAmode']).then(function (result) {
	switch (result.SFAmode) {
		case "back":
			browser.browserAction.setPopup({popup: ''});
			const snapdrop = new Snapdrop();
			break;
		default: //popup
			browser.browserAction.setPopup({popup: 'popup.html'});
			break;
	}
});

