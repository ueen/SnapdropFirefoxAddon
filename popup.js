browser.tabs.query({url: "*://*.snapdrop.net/*"}).then( tabs => {
	if (tabs.length <= 0) {
		document.getElementById('iframe').src = 'https://snapdrop.net/';
	} else {
		browser.tabs.update(tabs[0].id, {
		    active: true
		 });
		window.close();
	}
});