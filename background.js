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

async function preventCloseTab() {
    const activeTab = await getActiveTab();

    try {
        chrome.tabs.sendMessage(activeTab.id, { action: 'preventClose' });
    } catch (error) {
        console.error("Error in preventClose:", error);
    }
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
        }
    }
});
