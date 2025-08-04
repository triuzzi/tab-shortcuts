# 🗂️ Tab Shortcuts Extension

A Chrome extension that enhances browser productivity with keyboard shortcuts and UI controls for tab management and GitHub workflow optimization.

## 🛠️ Features

This extension provides four main functionalities:

- **Duplicate Tab**: Creates a duplicate of the current active tab (shortcut: `Ctrl+Shift+D`)
- **Pin Tab**: Toggles the pinned state of the current active tab (shortcut: `Ctrl+Shift+P`)
- **Collapse Translation Files**: On GitHub PR pages, collapses all translation files (*.json with 2-letter language codes) to reduce visual clutter (shortcut: `Ctrl+Shift+T`)
- **Convert Relative Time**: On GitHub pages, converts relative time stamps (like "2 hours ago") to absolute time format (like "10 September 2025, 10:15") (shortcut: `Ctrl+Shift+A`)

All features can be accessed via:
- Keyboard shortcuts
- Extension popup menu (click the extension icon)

## 💻 Usage

### For General Tab Management

- Use `Ctrl+Shift+D` to duplicate the current tab
- Use `Ctrl+Shift+P` to pin or unpin the current tab

### For GitHub Translation Files

When reviewing Pull Requests on GitHub with many translation files (like `en.json`, `de.json`, etc.):

1. Navigate to the PR page
2. Press `Ctrl+Shift+T` or click the extension icon and select "Collapse Translations"
3. All translation files will be collapsed, making it easier to focus on code changes

### For GitHub Time Conversion

When browsing GitHub and want to see exact timestamps instead of relative times:

1. Navigate to any GitHub page with relative timestamps (issues, PRs, commits, etc.)
2. Press `Ctrl+Shift+O` or click the extension icon and select "Convert Time to Absolute"
3. All relative times (like "2 hours ago") will be converted to absolute format (like "10 September 2025, 10:15")

## ⚙️ Installation

1. Download and extract the ZIP file
2. Go to Chrome settings (`chrome://extensions/`)
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extracted folder
5. The extension is now installed and ready to use
6. Optional: Navigate to the Extensions > Keyboard Shortcuts menu to customize shortcuts

## 🔧 Technical Details

This extension uses:
- Chrome Extension Manifest V3
- Background service worker for tab operations
- Content scripts for GitHub page interaction
- No external dependencies or network requests

## 📋 Version History

- **v1.3**: Added GitHub relative time to absolute time conversion feature
- **v1.2**: Added GitHub translation file collapsing feature and popup interface
- **v1.1**: Initial release with tab duplication and pinning functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Conclusions

All good: your productivity just **doubled**! Remember to ⭐️ this repository!
