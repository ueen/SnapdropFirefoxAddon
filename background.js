function openPage() {
  browser.tabs.create({
    url: "https://snapdrop.net/"
  });
}

browser.browserAction.onClicked.addListener(openPage);