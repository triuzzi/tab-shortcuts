async function duplicateTab() {
    const activeTab = await getActiveTab();
    return chrome.tabs.duplicate(activeTab.id);
}

async function pinTab() {
    const activeTab = await getActiveTab();
    return chrome.tabs.update(activeTab.id, { pinned: !activeTab.pinned });
}

async function collapseTranslationFilesOnGithub() {
    const activeTab = await getActiveTab();

    try {
        chrome.tabs.sendMessage(activeTab.id, { action: 'collapseTranslations' });
    } catch (error) {
        console.error("Error in collapseTranslations:", error);
    }
}

async function convertRelativeTimeOnGithub() {
    const activeTab = await getActiveTab();

    try {
        chrome.tabs.sendMessage(activeTab.id, { action: 'convertRelativeTime' });
    } catch (error) {
        console.error("Error in convertRelativeTime:", error);
    }
}

async function newTabHere({ active } = { active: true }) {
    const activeTab = await getActiveTab();
    if (!activeTab) return;
    return chrome.tabs.create({
        active,
        index: activeTab.index + 1,
        openerTabId: activeTab.id,
    });
}

async function preventCloseTab() {
    const activeTab = await getActiveTab();
    await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
            if (window.__tsPreventClose) {
                window.removeEventListener('beforeunload', window.__tsPreventClose);
                delete window.__tsPreventClose;
            } else {
                window.__tsPreventClose = (e) => { e.preventDefault(); e.returnValue = ''; };
                window.addEventListener('beforeunload', window.__tsPreventClose);
            }
        }
    });
}

async function getActiveTab() {
    return (await chrome.tabs.query({ currentWindow: true, active: true }))[0];
}

chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case 'duplicateTab':
            return duplicateTab();
        case 'pinTab':
            return pinTab();
        case 'collapseTranslations':
            return collapseTranslationFilesOnGithub();
        case 'convertRelativeTime':
            return convertRelativeTimeOnGithub();
        case 'preventClose':
            return preventCloseTab();
        case 'newTabHere':
            return newTabHere({ active: true });
        case 'newTabHereBackground':
            return newTabHere({ active: false });
    }
});

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== 'install') return;
    const commands = await chrome.commands.getAll();
    const manifestCommands = chrome.runtime.getManifest().commands || {};
    const anyUnboundSuggestedKey = commands.some((cmd) => {
        const entry = manifestCommands[cmd.name];
        return entry && entry.suggested_key && !cmd.shortcut;
    });
    if (anyUnboundSuggestedKey) {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.command) {
        switch (message.command) {
            case 'duplicateTab':
                duplicateTab();
                break;
            case 'pinTab':
                pinTab();
                break;
            case 'collapseTranslations':
                collapseTranslationFilesOnGithub();
                break;
            case 'convertRelativeTime':
                convertRelativeTimeOnGithub();
                break;
            case 'preventClose':
                preventCloseTab();
                break;
            case 'newTabHere':
                newTabHere({ active: true });
                break;
            case 'newTabHereBackground':
                newTabHere({ active: false });
                break;
        }
    }
});
