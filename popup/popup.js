// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
    setupButtonHandlers();
    loadCurrentShortcuts();
}

// Fetch and display current configured shortcuts
function loadCurrentShortcuts() {
    if (chrome.commands && chrome.commands.getAll) {
        chrome.commands.getAll(commands => {
            commands.forEach(command => {
                const buttonElement = document.getElementById(command.name);
                if (buttonElement) {
                    const shortcutSpan = buttonElement.querySelector('.keyboard');
                    if (shortcutSpan) {
                        shortcutSpan.textContent = command.shortcut || "Not set";
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
        'collapseTranslations': executeCollapseTranslations
    };

    // Attach click handlers to buttons
    Object.keys(buttons).forEach(buttonId => {
        const element = document.getElementById(buttonId);
        if (element) {
            element.addEventListener('click', buttons[buttonId]);
        }
    });

    // Configure shortcuts link
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

function sendCommandAndClose(command) {
    chrome.runtime.sendMessage({ command: command });
    window.close();
} 