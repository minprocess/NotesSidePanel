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

const accentarr = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'œ',
'ù', 'û', 'ü', 'ÿ', '€', '“', '”', '«', '»']


  const accentButtonsDiv = document.getElementById('accent-buttons');

  accentarr.forEach(character => {
    const button = document.createElement('button');
    button.textContent = character;
    button.addEventListener('click', function() {
      InsertSpecialCharacter(character);
    });
    accentButtonsDiv.appendChild(button);
  });

/*
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
*/
  // Get the current tab ID
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function (tabs) {
    const tabId = tabs[0].id;
    console.log('title ', tabs[0].title)
    // Load the saved note for the current tab

    chrome.storage.local.get([`note_${tabId}`], function (result) {
      const noteTextarea = document.getElementById('note');
      noteTextarea.value = result[`note_${tabId}`] || 'Hello world';

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
      console.log('note array')
      console.log(result)
      const noteTextarea = document.getElementById('note');
      noteTextarea.value = result[`note_${activeInfo.tabId}`] || '';
    });
  });

}); // document.addEventListener