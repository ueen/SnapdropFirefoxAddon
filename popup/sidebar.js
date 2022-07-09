//get active tab url for sending via textInput
document.addEventListener("contextmenu", (ev) => {
	browser.runtime.sendMessage("sidebarClick").then(response => {
		if (response != undefined) {
			document.getElementById("textInput").innerHTML = response;
		}
	});
});