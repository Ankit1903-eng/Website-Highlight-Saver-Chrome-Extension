console.log("Content script loaded!");

// Listen for the mouseup event to capture the text selection
document.addEventListener('mouseup', function () {
    const selection = window.getSelection().toString().trim();
    
    // If the selection has some text, show the "Save Highlight?" popup
    if (selection.length > 0) {
      showSavePopup(selection);
    }
});

// Function to display the popup near the selected text
function showSavePopup(selectedText) {
    // Create a new popup div element
    let popup = document.createElement('div');
    popup.innerText = "Save Highlight?";
    
    // Style the popup
    popup.style.position = 'absolute';
    popup.style.background = 'yellow';
    popup.style.border = '1px solid black';
    popup.style.padding = '5px';
    popup.style.cursor = 'pointer';
    popup.style.zIndex = 9999;
    
    // Position the popup near the selection
    const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
    popup.style.top = `${range.top + window.scrollY}px`;
    popup.style.left = `${range.left + window.scrollX}px`;
    
    // Append the popup to the body
    document.body.appendChild(popup);

    // When the popup is clicked, save the selected text
    popup.addEventListener('click', function () {
        chrome.storage.local.get({ highlights: [] }, function (result) {
            const updated = [...result.highlights, selectedText];
            chrome.storage.local.set({ highlights: updated });
            alert("Highlight saved!");
        });
        popup.remove();  // Remove the popup after saving
    });

    // Automatically remove the popup after 3 seconds if the user doesn't click
    setTimeout(() => {
      popup.remove();
    }, 3000);
}

  