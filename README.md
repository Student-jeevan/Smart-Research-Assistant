# 🧠 Research Assistant Chrome Extension

**Research Assistant** is a lightweight **Chrome Extension** that helps you quickly **summarize selected text** from web pages and **save research notes**. Key concepts wrapped in `**` are highlighted in **bold and color** for easy readability.

---

## ✨ Features

- Summarize selected text on any webpage.
- Highlight key phrases automatically (e.g., `**Method Concepts**`).
- Save and manage research notes locally in Chrome storage.
- Clean interface with preserved line breaks.

---

## 🛠 Setup

1. **Clone or download** this repository.
2. Open **Google Chrome** and go to:  
chrome://extensions/

3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the folder containing the extension files:
sidepanel.html
sidepanel.css
sidepanel.js
manifest.json

6. Ensure your backend API is running at:  
http://localhost:8080/api/research/process

The API should accept JSON:
```json
{
  "content": "text to summarize",
  "operation": "summarize"
}
📝 Usage
Click the Research Assistant icon in Chrome.

Select text on any webpage.

Click Summarize — the summarized content will appear below.

Save research notes by typing in the text area and clicking Save Notes.

📂 File Structure
/Research-Assistant
│
├─ sidepanel.html       # Main panel UI
├─ sidepanel.css        # Styling for panel
├─ sidepanel.js         # JavaScript logic
├─ manifest.json        # Chrome Extension manifest
⚠️ Notes
Works only on webpages where scripts can access selected text.

Cannot access text on chrome:// pages or the Chrome Web Store.

Keywords wrapped in ** (e.g., **Method Concepts**) are automatically highlighted.

🚀 Future Enhancements
Dark mode toggle

Loading spinner while processing

Text-to-speech for summaries

Advanced formatting options for summaries
