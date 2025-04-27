const API_KEY = 'YOUR_OPENAI_API_KEY'; // <-- Put your real OpenAI key here

document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('highlightsList');

  chrome.storage.local.get({ highlights: [] }, function (result) {
    result.highlights.forEach((highlight, index) => {
      const div = document.createElement('div');
      div.className = 'highlight';
      div.innerText = highlight;

      const button = document.createElement('button');
      button.innerText = 'Summarize';
      button.className = 'summarize-btn';
      button.onclick = function () {
        summarizeText(highlight, div);
      };

      const del = document.createElement('span');
      del.innerText = '🗑️';
      del.className = 'delete';
      del.onclick = function () {
        deleteHighlight(index);
      };

      div.appendChild(button);
      div.appendChild(del);
      list.appendChild(div);
    });
  });

  function deleteHighlight(index) {
    chrome.storage.local.get({ highlights: [] }, function (result) {
      const updated = result.highlights;
      updated.splice(index, 1);
      chrome.storage.local.set({ highlights: updated }, function () {
        window.location.reload();
      });
    });
  }

  async function summarizeText(text, parentDiv) {
    const summaryDiv = document.createElement('div');
    summaryDiv.innerText = 'Summarizing...';
    parentDiv.appendChild(summaryDiv);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'Summarize the following text in simple language.' },
            { role: 'user', content: text }
          ],
          max_tokens: 100
        })
      });

      const data = await response.json();
      const summary = data.choices[0].message.content.trim();
      summaryDiv.innerText = `Summary: ${summary}`;
    } catch (error) {
      console.error('Error summarizing:', error);
      summaryDiv.innerText = 'Failed to summarize.';
    }
  }
});
