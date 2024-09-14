document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('language-select').addEventListener('change', function() {
    const selectedLang = this.value;
    document.getElementById('note').setAttribute('lang', selectedLang);
  });

  function InsertSpecialCharacter(character) {
    const textarea = document.getElementById('note');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    textarea.value = before + character + after;
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    textarea.focus();
  }
  
  document.getElementById('insert-à').addEventListener('click', function() {
    InsertSpecialCharacter('à');
  });
  
  document.getElementById('insert-â').addEventListener('click', function() {
    InsertSpecialCharacter('â');
  });
 
  document.getElementById('insert-æ').addEventListener('click', function() {
    InsertSpecialCharacter('æ');
  });
 
  document.getElementById('insert-ç').addEventListener('click', function() {
    InsertSpecialCharacter('ç');
  });

  document.getElementById('insert-é').addEventListener('click', function() {
    InsertSpecialCharacter('é');
  });

  document.getElementById('insert-è').addEventListener('click', function() {
    InsertSpecialCharacter('è');
  });

  document.getElementById('insert-œ').addEventListener('click', function() {
    InsertSpecialCharacter('œ');
  });

  document.getElementById('insert-e-aigu').addEventListener('click', function() {
    const textarea = document.getElementById('note');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    textarea.value = before + 'é' + after;
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    textarea.focus();
  });

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