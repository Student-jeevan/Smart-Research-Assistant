
# Research Assistant Chrome Extension

Research Assistant is a lightweight Chrome Extension that helps you quickly summarize selected text from web pages and save research notes.

##  Features
Summarize selected text on any webpage.
Highlight key phrases automatically (e.g., **Method Concepts**).
Save and manage research notes locally in Chrome storage.
Clean interface with preserved line breaks.
## Setup

Clone or download this repository.

Open Google Chrome and go to:
chrome://extensions/

Enable Developer mode (toggle in the top-right corner).

Click Load unpacked.

Select the folder containing the extension files: sidepanel.html sidepanel.css sidepanel.js manifest.json

Ensure your backend API is running at:
http://localhost:8080/api/research/process
## API Format

The API should accept JSON:

{
    
     "content": "text to summarize",
     "operation": "summarize"
}
## Usage
Click the Research Assistant icon in Chrome.

Select text on any webpage.

Click Summarize — the summarized content will appear below.

Save research notes by typing in the text area and clicking Save Notes.
##  File Structure


/Research-Assistant


├─ sidepanel.html       # Main panel UI

├─ sidepanel.css        # Styling for panel

├─ sidepanel.js         # JavaScript logic

├─ manifest.json        # Chrome Extension manifest
##  Notes
Works only on webpages where scripts can access selected text.

Cannot access text on chrome:// pages or the Chrome Web Store.

Keywords wrapped in ** (e.g., **Method Concepts**) are automatically highlighted.
## Future Enhancements

🌙 Dark mode toggle

⏳ Loading spinner while processing

🔊 Text-to-speech for summaries

🎨 Advanced formatting options for summaries
