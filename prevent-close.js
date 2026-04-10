let isPreventCloseActive = false;

function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
}

function togglePreventClose() {
    if (isPreventCloseActive) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        isPreventCloseActive = false;
    } else {
        window.addEventListener('beforeunload', handleBeforeUnload);
        isPreventCloseActive = true;
    }
    return isPreventCloseActive;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'preventClose') {
        const status = togglePreventClose();
        sendResponse({ status: status });
    }
    return true;
});