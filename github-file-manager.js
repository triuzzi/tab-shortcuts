// Handles toggling reviewed status of translation files in GitHub PRs
(() => {
    // Setup message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'collapseTranslations') {
            const count = toggleTranslationFiles();
            sendResponse({ count: count });
        }
        return true; // Keep message channel open for async response
    });
})();

function toggleTranslationFiles() {
    const fileLinks = findFileLinks();
    let translationFilesCount = 0;

    fileLinks.forEach(fileLink => {
        const filename = fileLink.textContent.trim() || fileLink.getAttribute('title') || '';

        // Check if file matches xx.json pattern where xx is a two-letter language code
        if (/\/[a-z]{2}\.json$|^[a-z]{2}\.json$/.test(filename)) {
            translationFilesCount++;

            const fileContainer = findFileContainer(fileLink);
            if (fileContainer) {
                toggleFileReviewStatus(fileContainer);
            }
        }
    });

    return translationFilesCount;
}

function findFileLinks() {
    const possibleSelectors = [
        '.js-diff-progressive-container a.Link--primary',
        '.file-header a[title*=".json"]',
        'a[title*=".json"]',
        '.file-info a'
    ];

    for (const selector of possibleSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            return Array.from(elements);
        }
    }

    return [];
}

function findFileContainer(fileLink) {
    let fileContainer = fileLink.closest('.js-file') || fileLink.closest('.file');

    if (!fileContainer) {
        let el = fileLink;
        // Traverse up to 10 levels to find container
        for (let i = 0; i < 10; i++) {
            el = el.parentElement;
            if (!el) break;
            if (el.classList.contains('file') ||
                el.classList.contains('js-file') ||
                el.classList.contains('js-details-container')) {
                fileContainer = el;
                break;
            }
        }
    }

    return fileContainer;
}

function toggleFileReviewStatus(fileContainer) {
    // Try to find checkbox in file actions
    const fileActions = fileContainer.querySelector('.file-actions');
    if (fileActions) {
        const form = fileActions.querySelector('.js-toggle-user-reviewed-file-form');
        if (form) {
            const checkbox = form.querySelector('input.js-reviewed-checkbox[type="checkbox"]');
            if (checkbox) {
                const label = form.querySelector('label.js-reviewed-toggle');
                if (label) {
                    label.click();
                } else {
                    checkbox.click();
                }
                return true;
            }
        }
    }

    // Try alternative selectors if above method fails
    const checkboxSelectors = [
        'input.js-reviewed-checkbox[type="checkbox"]',
        'label.js-reviewed-toggle input[type="checkbox"]',
        '.js-toggle-user-reviewed-file-form input[type="checkbox"]',
        '.file-header-action input[type="checkbox"]',
        'input[name="viewed"]'
    ];

    for (const selector of checkboxSelectors) {
        const checkboxes = Array.from(fileContainer.querySelectorAll(selector));
        for (const checkbox of checkboxes) {
            const label = checkbox.closest('label');
            if (label) {
                label.click();
            } else {
                checkbox.click();
            }
            return true;
        }
    }

    // Fallback to GitHub API
    try {
        const filePath = getFilePath(fileContainer);
        if (filePath) {
            const reviewLinks = document.querySelectorAll(`a[href*="${filePath}"][href*="file_review"]`);
            if (reviewLinks.length > 0) {
                reviewLinks[0].click();
                return true;
            }
        }
    } catch (e) { }

    return false;
}

function getFilePath(fileContainer) {
    // Try multiple methods to get file path
    let filePath = fileContainer.getAttribute('data-path');
    if (filePath) return filePath;

    const pathInput = fileContainer.querySelector('input[name="path"]');
    if (pathInput) return pathInput.value;

    const fileLink = fileContainer.querySelector('a.Link--primary');
    if (fileLink) {
        return fileLink.getAttribute('title') || fileLink.textContent.trim();
    }

    return null;
} 