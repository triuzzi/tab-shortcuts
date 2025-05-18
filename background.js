/**
 * Tab Shortcuts Extension - Background Service Worker
 * Handles commands and message passing for tab operations
 */

/**
 * Creates a duplicate of the active tab
 */
async function duplicateTab() {
    const activeTab = await getActiveTab();
    return chrome.tabs.duplicate(activeTab.id);
}

/**
 * Toggles the pinned state of the active tab
 */
async function pinTab() {
    const activeTab = await getActiveTab();
    return chrome.tabs.update(activeTab.id, { pinned: !activeTab.pinned });
}

/**
 * Sends a message to the github file manager to collapse translation files
 */
async function collapseTranslationFilesOnGithub() {
    const activeTab = await getActiveTab();

    try {
        // Send message to the github file manager
        chrome.tabs.sendMessage(activeTab.id, { action: 'collapseTranslations' });
    } catch (error) {
        console.error("Error in collapseTranslations:", error);
    }
}

/**
 * Helper function to get the active tab
 */
async function getActiveTab() {
    return (await chrome.tabs.query({ currentWindow: true, active: true }))[0];
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case 'duplicateTab':
            return duplicateTab();
        case 'pinTab':
            return pinTab();
        case 'collapseTranslations':
            return collapseTranslationFilesOnGithub();
    }
});

// Handle messages from popup
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
        }
    }
});
