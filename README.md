# Take Note - A Google Chrome and Edge extension that create a side panel for taking notes

## Description
Adds a side panel on right side of Chrome or Edge browsers. Has a text area to enter text unique to each tab. Has a Save Note button to save to local storage. Text for each tab is kept in local storage so that if you switch to another tab and return back you will see the text saved for that tab. If you switch to another tab before clicking the Save Note button the text typed since the last Save Note button click will be lost. 

## Development
This extension makes use of the Chrome Extension API
<https://developer.chrome.com/docs/extensions/reference/api>

See the SidePanel API Demo shows several API methods and properties. 
<https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.sidepanel-open>

Manifest.json specifies which of the Chrome Extension APIs are used in the project. The "Permission" key shows that the storage, tabs and sidePanel APIs are used.
  "permissions": ["storage", "tabs", "sidePanel"],

The side panel is created with this kev-value pair in manifest.json
  "side_panel": {
    "default_path": "sidepanel.html"
  }

This extension does not use content scripts or service workers. Just one JavaScript file is used: sidepanel.js

