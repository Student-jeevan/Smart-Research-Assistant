document.addEventListener('DOMContentLoaded', () => {
    // Function to load notes from storage and populate the textarea
    function loadNotes() {
        chrome.storage.local.get(['researchNotes'], function(result) {
            const notesElement = document.getElementById('notes');
            if (result.researchNotes && notesElement) {
                notesElement.value = result.researchNotes;
            }
        });
    }

    // Call loadNotes immediately when the DOM is ready
    loadNotes(); 

    document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
    document.getElementById('savenotes').addEventListener('click', saveNotes);
});

async function summarizeText() {
    showResult('Processing...');
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result: selectedText }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString()
        });

        if (!selectedText) {
            showResult('Please select some text first');
            return;
        }

        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: selectedText,
                operation: 'summarize',
                formatting_rule: 'Summarize in three distinct points. Start each point with a long dash (—) followed by a space. Do NOT use markdown asterisks or bullet points (*, -, +). Use HTML <b> and <u> tags for the main topic.'
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const text = await response.text();

        // Remove common list markers (*, -, 1., 2.) at the start of lines
        let cleanText = text.replace(/^[\*\-\+] /gm, '').replace(/^\d+\.\s*/gm, '');

        // Highlight keywords wrapped in ** **
        let formattedText = cleanText
            .replace(/\*\*(.*?)\*\*/g, "<span class='highlight'>$1</span>")
            .replace(/\n/g, "<br>");

        showResult(formattedText);
    } catch (error) {
        showResult('Error:' + error.message);
    }
}

async function saveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ 'researchNotes': notes }, function() {
        showResult('Notes saved successfully');
        setTimeout(() => showResult(''), 3000);
    });
}

function showResult(content) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
}
