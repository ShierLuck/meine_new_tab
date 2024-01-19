var blank = chrome.extension.getURL("/start/index.html");
var start = "opera://startpage/";

chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.status === "complete" && tab.url === start) {
        chrome.tabs.update(tab.id, {
            url: blank
        });
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url === start) {
        chrome.tabs.update(tabId, {
            url: blank
        });
    }
});