browser.tabs.query({}).then( tabs => {
	let sdTabs = tabs.filter(tab => tab.url.match(/.*:\/\/.*\.*snapdrop\.net\/.*/));
	if (sdTabs.length <= 0) {
		main(tabs.filter(tab => tab.active)[0].url);
	} else {
		browser.tabs.update(sdTabs[0].id, {
		    active: true
		 });
		window.close();
	}
});

function main(shareTargetText) {
	browser.runtime.sendMessage({action: "stop"})

	let iframe = document.getElementById('iframe');
	//automatically past current url
	iframe.src = 'https://snapdrop.net/?url='+shareTargetText;

	window.onunload = function(event) { browser.runtime.sendMessage({action: "restart"}); };
}