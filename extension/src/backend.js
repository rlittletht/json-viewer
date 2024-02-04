var chrome = require('chrome-framework');
var Storage = require('./json-viewer/storage');

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        (async () => {
            try {
                if (request.action === "GET_OPTIONS") {
                    var resp = await Storage.load();

                    console.log("resp: " + JSON.stringify(resp));
                    sendResponse({ err: null, value: resp });
                }
            }
            catch (e) {
                console.error('[JSONViewer] error: ' + e.message, e);
                sendResponse({ err: e });
            }
        })();
        return true;
    });