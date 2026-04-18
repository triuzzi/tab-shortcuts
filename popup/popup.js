document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
    setupButtonHandlers();
    loadCurrentShortcuts();
}

function loadCurrentShortcuts() {
    if (chrome.commands && chrome.commands.getAll) {
        chrome.commands.getAll(commands => {
            commands.forEach(command => {
                const buttonElement = document.getElementById(command.name);
                if (buttonElement) {
                    const shortcutSpan = buttonElement.querySelector('.keyboard');
                    if (shortcutSpan) {
                        if (command.shortcut) {
                            shortcutSpan.textContent = command.shortcut;
                            shortcutSpan.classList.remove('unbound');
                        } else {
                            shortcutSpan.textContent = '<unbound>';
                            shortcutSpan.classList.add('unbound');
                        }
                    }
                }
            });
        });
    }
}

function setupButtonHandlers() {
    const buttons = {
        'duplicateTab': executeDuplicateTab,
        'pinTab': executePinTab,
        'collapseTranslations': executeCollapseTranslations,
        'convertRelativeTime': executeConvertRelativeTime,
        'preventClose': executePreventClose,
        'newTabHere': executeNewTabHere,
        'newTabHereBackground': executeNewTabHereBackground
    };

    Object.keys(buttons).forEach(buttonId => {
        const element = document.getElementById(buttonId);
        if (element) {
            element.addEventListener('click', buttons[buttonId]);
        }
    });

    const configLink = document.getElementById('configureShortcuts');
    if (configLink) {
        configLink.addEventListener('click', () => {
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
            window.close();
        });
    }
}

function executeDuplicateTab() {
    sendCommandAndClose('duplicateTab');
}

function executePinTab() {
    sendCommandAndClose('pinTab');
}

function executeCollapseTranslations() {
    sendCommandAndClose('collapseTranslations');
}

function executeConvertRelativeTime() {
    sendCommandAndClose('convertRelativeTime');
}

function executePreventClose() {
    sendCommandAndClose('preventClose');
}

function executeNewTabHere() {
    sendCommandAndClose('newTabHere');
}

function executeNewTabHereBackground() {
    sendCommandAndClose('newTabHereBackground');
}

function sendCommandAndClose(command) {
    chrome.runtime.sendMessage({ command: command });
    window.close();
} 