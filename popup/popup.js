document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
    setupButtonHandlers();
    loadCurrentShortcuts();
}

const MODIFIER_SYMBOLS = {
    '⌃': 'Ctrl',
    '⇧': 'Shift',
    '⌥': 'Opt',
    '⌘': 'Cmd',
    '⎇': 'Alt'
};

function parseShortcut(shortcut) {
    if (shortcut.includes('+')) {
        return shortcut.split('+').map(s => s.trim()).filter(Boolean);
    }
    const parts = [];
    let i = 0;
    while (i < shortcut.length) {
        const ch = shortcut[i];
        if (MODIFIER_SYMBOLS[ch]) {
            parts.push(MODIFIER_SYMBOLS[ch]);
            i++;
        } else {
            parts.push(shortcut.slice(i));
            break;
        }
    }
    return parts;
}

function renderShortcut(container, shortcut) {
    container.textContent = '';
    if (!shortcut) {
        container.classList.add('unset');
        container.textContent = 'unset';
        return;
    }
    container.classList.remove('unset');
    parseShortcut(shortcut).forEach((key, i) => {
        if (i > 0) {
            const plus = document.createElement('span');
            plus.className = 'plus';
            plus.textContent = '+';
            container.appendChild(plus);
        }
        const kbd = document.createElement('kbd');
        kbd.textContent = key;
        container.appendChild(kbd);
    });
}

function loadCurrentShortcuts() {
    if (chrome.commands && chrome.commands.getAll) {
        chrome.commands.getAll(commands => {
            commands.forEach(command => {
                const buttonElement = document.getElementById(command.name);
                if (buttonElement) {
                    const shortcutSpan = buttonElement.querySelector('.keyboard');
                    if (shortcutSpan) {
                        renderShortcut(shortcutSpan, command.shortcut);
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