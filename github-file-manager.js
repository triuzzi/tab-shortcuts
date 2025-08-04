(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'collapseTranslations':
                const count = toggleTranslationFiles();
                sendResponse({ count: count });
                break;
            case 'convertRelativeTime':
                const convertedCount = convertRelativeTimeToAbsolute();
                sendResponse({ count: convertedCount });
                break;
        }
        return true;
    });
})();

function toggleTranslationFiles() {
    const fileLinks = findFileLinks();
    let translationFilesCount = 0;

    fileLinks.forEach(fileLink => {
        const filename = fileLink.textContent.trim() || fileLink.getAttribute('title') || '';

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

function convertRelativeTimeToAbsolute() {
    const elements = document.querySelectorAll("relative-time");
    let convertedCount = 0;

    elements.forEach(function (el) {
        const absoluteTime = document.createElement("absolute-time");

        for (let attr of el.attributes) {
            absoluteTime.setAttribute(attr.name, attr.value);
        }

        absoluteTime.innerHTML = el.innerHTML;

        el.parentNode.replaceChild(absoluteTime, el);
        convertedCount++;
    });

    return convertedCount;
} 