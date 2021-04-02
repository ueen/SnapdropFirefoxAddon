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
	browser.runtime.connect({ name: "popup" });

	let iframe = document.getElementById('iframe');
	//automatically past current url
	iframe.src = 'https://snapdrop.net/?url='+shareTargetText;
}