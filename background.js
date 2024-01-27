async function duplicateTab() {
    const activeTab = await _getActiveTab()
    return chrome.tabs.duplicate(activeTab.id)
}

async function pinTab() {
    const activeTab = await _getActiveTab()
    return chrome.tabs.update(activeTab.id, {pinned: !activeTab.pinned});
}

async function _getActiveTab() {
    return (await chrome.tabs.query({currentWindow: true, active: true}))[0];
}

chrome.commands.onCommand.addListener(async (command) => {
    console.debug(`command: ${command}`)
    switch (command) {
        case 'duplicateTab':
            return duplicateTab()
        case 'pinTab':
            return pinTab()
    }
});
