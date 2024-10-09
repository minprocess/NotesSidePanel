document.addEventListener('DOMContentLoaded', function () {
  const noteTextarea = document.getElementById('note');
  const saveButton = document.getElementById('save');
  
  const accentarr = 'àâæçéèêëïîôœùûüÿ€“”«»'.split('');
  const accentarrUC = 'ÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ€“”«»'.split('');

  const accentButtonsDiv = document.getElementById('accent-buttons');

  // 'language-select' is a drop down menu
  document.getElementById('language-select').addEventListener('change', function() {
    const selectedLang = this.value;
    noteTextarea.setAttribute('lang', selectedLang);
  });

  function InsertSpecialCharacter(character) {
    const start = noteTextarea.selectionStart;
    const end = noteTextarea.selectionEnd;
    const text = noteTextarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    noteTextarea.value = before + character + after;
    noteTextarea.selectionStart = noteTextarea.selectionEnd = start + 1;
    noteTextarea.focus();
  }

  accentarr.forEach(character => {
    const button = document.createElement('button');
    button.textContent = character;
    button.addEventListener('click', function() {
      InsertSpecialCharacter(character);
    });
    accentButtonsDiv.appendChild(button);
  });

  // Get the current tab ID
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function (tabs) {
    const tabId = tabs[0].id;

    // Load the saved note for the current tab
    chrome.storage.local.get([`note_${tabId}`], function (result) {
      noteTextarea.value = result[`note_${tabId}`] || 'Hello world';
    });
  }); // end of chrome.tabs.query

  // Save the note when the Save Note button is clicked
  saveButton.addEventListener('click', function () {
    const queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    chrome.tabs.query(queryOptions, function(tabs) {
      const tabId = tabs[0].id;
      chrome.storage.local.set({ [`note_${tabId}`]: noteTextarea.value });  
    });
    noteTextarea.classList.remove('focused');
    // ToDo: Disable the Save button
  });

  // Handle tab activation
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    // ToDo: remove 'focused' class from noteTextarea
    chrome.storage.local.get([`note_${activeInfo.tabId}`], function (result) {
      noteTextarea.value = result[`note_${activeInfo.tabId}`] || '';
    });
  });

  noteTextarea.addEventListener('click', function() {
    // ToDo: Enable the Save button
    noteTextarea.classList.add('focused');
  });

}); // End of document.addEventListener('DOMContentLoaded', ... )