browser.storage.sync.get({Servr:"https://snapdrop.net"}).then(function (result) {
	browser.tabs.query({}).then( tabs => {
		let sdTabs = tabs.filter(tab => tab.url.includes(result.Servr.split("//")[1]));
		if (sdTabs.length <= 0) {
			main(result.Servr, tabs.filter(tab => tab.active)[0].url);
		} else {
			browser.tabs.update(sdTabs[0].id, {
			    active: true
			 });
			window.close();
		}
	});
});

function main(servr, shareTargetText) {
	browser.runtime.connect({ name: "popup" });

	let iframe = document.getElementById('iframe');

	//automatically past current url
	iframe.src = servr+'/?url='+shareTargetText;
}