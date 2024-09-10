document.addEventListener('DOMContentLoaded', function () {
  // Get the current tab ID
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function (tabs) {
    const tabId = tabs[0].id;

    // Load the saved note for the current tab
    chrome.storage.local.get([`note_${tabId}`], function (result) {
      const noteTextarea = document.getElementById('note');
      noteTextarea.value = result[`note_${tabId}`] || '';
    });
  }); // chrome.tabs.query

  // Save the note when the button is clicked
  const saveButton = document.getElementById('save'); 
  saveButton.addEventListener('click', function () {
    const queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    chrome.tabs.query(queryOptions, function(tabs) {
      const tabId = tabs[0].id
      const noteTextarea = document.getElementById('note');
      chrome.storage.local.set({ [`note_${tabId}`]: noteTextarea.value });  
    });
  });

  // Handle tab activation
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.storage.local.get([`note_${activeInfo.tabId}`], function (result) {
      const noteTextarea = document.getElementById('note');
      noteTextarea.value = result[`note_${activeInfo.tabId}`] || '';
    });
  });

}); // document.addEventListener