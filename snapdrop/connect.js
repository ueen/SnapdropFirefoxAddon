//ui.js modified

const isURL = text => /^((https?:\/\/|www)[^\s]+)/g.test(text.toLowerCase());

class Notifications {

    constructor() {
        // Check if the browser supports notifications
        if (!('Notification' in window)) return;

        Events.on('text-received', e => this._messageNotification(e.detail.text));
        Events.on('file-received', e => this._downloadNotification(e.detail));

        this._handlerQueue = [];

        browser.downloads.onChanged.addListener(function (delta) {
          if (delta.state && delta.state.current === "complete") {
            URL.revokeObjectURL(delta.url);
          }
        });

        let _self = this;

        browser.notifications.onClicked.addListener(function(notification) {
          _self._handlerQueue[notification]();
        });
    }

    _notify(message, body, closeTimeout = 20000) {
        var notification = Date.now().toString();
        browser.notifications.create(notification, {
            "type": "basic",
            "iconUrl": browser.extension.getURL("sd.png"),
            "title": message,
            "message": body
          });
        console.log('notify');
        // Notification is persistent on Android. We have to close it manually
        if (closeTimeout) {
            setTimeout(_ => browser.notifications.clear(notification), closeTimeout);
        }

        return notification;
    }

    _messageNotification(message) {
        if (isURL(message)) {
            const notification = this._notify(message, 'Click to open link');
            this._bind(notification, e => browser.tabs.create({url: message}));
        } else {
            const notification = this._notify(message, 'Click to copy text');
            this._bind(notification, e => this._copyText(message));
        }
    }

    _downloadNotification(file) {
        const notification = this._notify(file.name, 'Click to download');
        //if (!window.isDownloadSupported) return;
        this._bind(notification, e => this._download(file));
    }

    _download(file) {
        var url = URL.createObjectURL(file.blob);
        browser.downloads.download({
            url: url,
            filename: file.name
        });
    }

    _copyText(message) {
        if (!navigator.clipboard.writeText(message)) return;
        this._notify('Copied text to clipboard');
    }

    _bind(notification, handler) {
        this._handlerQueue[notification] = handler;
    }

}

class NetworkStatusUI {

    constructor() {
        window.addEventListener('offline', e => this._showOfflineMessage(), false);
        window.addEventListener('online', e => this._showOnlineMessage(), false);
        if (!navigator.onLine) this._showOfflineMessage();
    }

    _showOfflineMessage() {
        Events.fire('notify-user', 'You are offline');
    }

    _showOnlineMessage() {
        Events.fire('notify-user', 'You are back online');
    }
}

class WebShareTargetUI {
    constructor() {
        const parsedUrl = new URL(window.location);
        const title = parsedUrl.searchParams.get('title');
        const text = parsedUrl.searchParams.get('text');
        const url = parsedUrl.searchParams.get('url');

        let shareTargetText = title ? title : '';
        shareTargetText += text ? shareTargetText ? ' ' + text : text : '';

        if(url) shareTargetText = url; // We share only the Link - no text. Because link-only text becomes clickable.

        if (!shareTargetText) return;
        window.shareTargetText = shareTargetText;
        history.pushState({}, 'URL Rewrite', '/');
        console.log('Shared Target Text:', '"' + shareTargetText + '"');
    }
}


class Snapdrop {
    constructor(url) {
        this.server = new ServerConnection(url);
        const peers = new PeersManager(this.server);
        //const peersUI = new PeersUI();
        //call after load!
        const notifications = new Notifications();
        const networkStatusUI = new NetworkStatusUI();
        const webShareTargetUI = new WebShareTargetUI();
    }

    get server() {
        return this._server;
    }
    set server(s) {
        this._server = s;
    }
}

//const snapdrop = new Snapdrop();
//in background.js