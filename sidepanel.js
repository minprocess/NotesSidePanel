document.addEventListener('DOMContentLoaded', function () {
  const noteTextarea = document.getElementById('note');
  const translatedTextarea = document.getElementById('translated-note');
  const saveButton = document.getElementById('save');
  const translateButton = document.getElementById('translate-button');
  const languageSelect = document.getElementById('language-select');
  
  const accentarr = 'àâæçéèêëïîôœùûüÿ€""«»'.split('');
  const accentarrUC = 'ÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ€""«»'.split('');

  const accentButtonsDiv = document.getElementById('accent-buttons');
  let isShiftPressed = false;

  // Translation functionality
  translateButton.addEventListener('click', async function() {
    const text = noteTextarea.value;
    const targetLang = languageSelect.value;
    
    if (!text.trim()) {
      translatedTextarea.value = '';
      return;
    }

    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      
      // Extract translated text from the response
      const translatedText = data[0]
        .map(item => item[0])
        .join('');
      
      translatedTextarea.value = translatedText;
    } catch (error) {
      translatedTextarea.value = 'Translation error. Please try again.';
      console.error('Translation error:', error);
    }
  });

  // Accent mappings for supported characters
  const accentMappings = {
    'a': [
      { char: 'à', number: 1 },
      { char: 'â', number: 2 }
    ],
    'c': [
      { char: 'ç', number: 1 }
    ],
    'e': [
      { char: 'é', number: 1 },
      { char: 'è', number: 2 },
      { char: 'ê', number: 3 },
      { char: 'ë', number: 4 }
    ],
    'i': [
      { char: 'ï', number: 1 },
      { char: 'î', number: 2 }
    ],
    'o': [
      { char: 'ô', number: 2 }
    ],
    'u': [
      { char: 'ù', number: 1 },
      { char: 'û', number: 2 },
      { char: 'ü', number: 3 }
    ],
    'y': [
      { char: 'ÿ', number: 2 }
    ]
  };

  // Track pressed keys to prevent repeat
  const pressedKeys = new Set();

  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'accent-popup';
  document.body.appendChild(popup);

  let activeChar = null;

  function showAccentPopup(char, rect) {
    if (!accentMappings[char]) return;

    activeChar = char;
    popup.innerHTML = '';
    
    accentMappings[char].forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'accent-option';
      
      const charSpan = document.createElement('span');
      charSpan.className = 'accent-char';
      charSpan.textContent = option.char;
      
      const numberSpan = document.createElement('span');
      numberSpan.className = 'accent-number';
      numberSpan.textContent = option.number;
      
      optionDiv.appendChild(charSpan);
      optionDiv.appendChild(numberSpan);
      
      optionDiv.addEventListener('click', () => {
        insertAccentedCharacter(option.char);
      });
      
      popup.appendChild(optionDiv);
    });

    // Position popup above the cursor
    const popupHeight = 60; // Approximate height of popup
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top - popupHeight}px`;
    popup.classList.add('show');
  }

  function hideAccentPopup() {
    popup.classList.remove('show');
    activeChar = null;
  }

  function insertAccentedCharacter(char) {
    const start = noteTextarea.selectionStart;
    const text = noteTextarea.value;
    
    // Insert the accented character at current position
    const before = text.substring(0, start);
    const after = text.substring(start);
    
    // Insert the accented character
    noteTextarea.value = before + char + after;
    noteTextarea.selectionStart = noteTextarea.selectionEnd = start + 1;
    noteTextarea.focus();
    
    hideAccentPopup();
  }

  // Handle keydown for popup and repeat prevention
  noteTextarea.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    
    // Only show popup if Alt key is pressed and it's a mappable character
    if (e.altKey && accentMappings[key]) {
      if (pressedKeys.has(key)) {
        e.preventDefault();
        return;
      }
      
      pressedKeys.add(key);
      e.preventDefault(); // Prevent default character insertion

      // Get cursor position and show popup
      const pos = this.selectionStart;
      const coords = getCaretCoordinates(this, pos);
      const rect = this.getBoundingClientRect();
      
      showAccentPopup(key, {
        left: rect.left + coords.left,
        top: rect.top + coords.top
      });
    }
  });

  // Handle keyup to remove from pressed keys
  noteTextarea.addEventListener('keyup', function(e) {
    const key = e.key.toLowerCase();
    pressedKeys.delete(key);
    
    // Don't hide popup on keyup of the trigger key
    if (key !== activeChar) {
      hideAccentPopup();
    }
  });

  // Handle number key shortcuts
  document.addEventListener('keydown', function(e) {
    if (activeChar && /^[1-9]$/.test(e.key)) {
      const number = parseInt(e.key);
      const options = accentMappings[activeChar];
      const option = options.find(opt => opt.number === number);
      
      if (option) {
        e.preventDefault();
        insertAccentedCharacter(option.char);
      }
    } else if (e.key === 'Escape') {
      hideAccentPopup();
    } else if (e.key === 'Shift' && !isShiftPressed) {
      isShiftPressed = true;
      updateButtonTexts();
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
      isShiftPressed = false;
      updateButtonTexts();
    }
  });

  // Hide popup when clicking outside
  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== noteTextarea) {
      hideAccentPopup();
    }
  });

  // Get caret coordinates helper function
  function getCaretCoordinates(element, position) {
    const div = document.createElement('div');
    const style = getComputedStyle(element);
    const properties = [
      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
      'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent',
      'whiteSpace', 'lineHeight', 'padding', 'border', 'boxSizing'
    ];

    properties.forEach(prop => {
      div.style[prop] = style[prop];
    });

    div.textContent = element.value.substring(0, position);
    
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    
    div.style.cssText += `
      position: absolute;
      visibility: hidden;
      white-space: pre-wrap;
      width: ${element.offsetWidth}px
    `;
    
    document.body.appendChild(div);
    const coordinates = {
      top: span.offsetTop,
      left: span.offsetLeft
    };
    document.body.removeChild(div);
    
    return coordinates;
  }

  // Original accent buttons functionality
  function InsertSpecialCharacter(index) {
    const character = isShiftPressed ? accentarrUC[index] : accentarr[index];
    const start = noteTextarea.selectionStart;
    const end = noteTextarea.selectionEnd;
    const text = noteTextarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    noteTextarea.value = before + character + after;
    noteTextarea.selectionStart = noteTextarea.selectionEnd = start + 1;
    noteTextarea.focus();
  }

  function updateButtonTexts() {
    const buttons = accentButtonsDiv.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].textContent = isShiftPressed ? accentarrUC[i] : accentarr[i];
    }
  }

  // Create accent buttons
  accentarr.forEach((character, index) => {
    const button = document.createElement('button');
    button.textContent = character;
    button.addEventListener('click', function() {
      InsertSpecialCharacter(index);
    });
    accentButtonsDiv.appendChild(button);
  });

  // 'language-select' is a drop down menu
  languageSelect.addEventListener('change', function() {
    const selectedLang = this.value;
    noteTextarea.setAttribute('lang', selectedLang);
  });

  // Get the current tab ID
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, function (tabs) {
    const tabId = tabs[0].id;

    // Load the saved note for the current tab
    console.log(`chrome.tabs.query note_${tabId}`);
    chrome.storage.local.get([`note_${tabId}`], function (result) {
      noteTextarea.value = result[`note_${tabId}`] || 'Hello world';
    });
  });

  // Save the note when the Save Note button is clicked
  saveButton.addEventListener('click', function () {
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, function(tabs) {
      const tabId = tabs[0].id;
      chrome.storage.local.set({ [`note_${tabId}`]: noteTextarea.value });  
    });
    if (noteTextarea.classList.contains('focused')) {
      noteTextarea.classList.remove('focused');
    }
  });

  // Handle tab activation
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log(`chrome.tabs.onActivated tabId: ${activeInfo.tabId}`);
    if (noteTextarea.classList.contains('focused')) {
      noteTextarea.classList.remove('focused');
    }
    chrome.storage.local.get([`note_${activeInfo.tabId}`], function (result) {
      noteTextarea.value = result[`note_${activeInfo.tabId}`] || '';
    });
  });

  noteTextarea.addEventListener('click', function() {
    if (!noteTextarea.classList.contains('focused')) {
      noteTextarea.classList.add('focused');
    } 
  });
});
