document.addEventListener('DOMContentLoaded' , ()=>{
    chrome.storage.local.get(['researchNotes'] , function(result){
        if(result.researchNotes){
            document.getElementById('notes').value = result.researchNotes;
        }
    });
    document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
    document.getElementById('savenotes').addEventListener('click', saveNotes);
});

async function summarizeText(){
    showResult('Processing...');
    try{
        const [tab] = await chrome.tabs.query({active:true , currentWindow: true});
        const [{result: selectedText}] = await chrome.scripting.executeScript({
            target:{tabId:tab.id},
            function: ()=>window.getSelection().toString()
        });

        if(!selectedText){
            showResult('Please select some text first');
            return ;
        }

        const response = await fetch('http://localhost:8080/api/research/process' , {
            method:'POST' , 
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({content: selectedText ,operation:'summarize'})
        });
        if(!response.ok){
            throw new Error(`API Error: ${response.status}`);
        }

        const text = await response.text();
        showResult(text.replace(/\n/g, '<br>'));
    }
    catch(error){
        showResult('Error:'+ error.message);
    }
}
async function saveNotes(){
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({'researchNotes':notes} , function(){
        showResult('Notes saved successfully');
        setTimeout(() => showResult(''), 3000);
    });
}

function showResult(content){
    const resultsDiv = document.getElementById('results');
    
    if (!resultsDiv) {
        return; 
    }

    resultsDiv.innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
}