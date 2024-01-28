/* Global Variables Here */
sidebarHidden = false;
subitemShow = false;
darkMode = false;
chatboardOpen = false;

var chat = [
    {
        type: "response",
        content: "I am your Corporate Investigator Assistant. How can I help you today?"
    }
]

/* Toggle Sidebar Function */
const toggleSidebar = () => {
    const sidebar= document.getElementById('main');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarToggleBtnDiv = document.getElementById('sidebarBtnDiv');

    sidebarHidden = !sidebarHidden;
    if(sidebarHidden) {
        sidebar.classList.remove('main');
        sidebarToggleBtn.style.transform = 'rotate(180deg)';
        // sidebarToggleBtnDiv.style.transform = 'translateX(var(--sidebar-width))'
        sidebarToggleBtnDiv.style.left = 0;
    } else {
        sidebar.classList.add('main');
        sidebarToggleBtn.style.transform = 'rotate(0deg)';
        sidebarToggleBtnDiv.style.left = 'var(--sidebar-width)';
    }
}

/* For Register Category in sidebar */
const toggleSubitem = () => {
    const downArrow = document.getElementById('subitemShowbtn');

    subitemShow = !subitemShow;
    if(subitemShow) downArrow.style.transform = 'rotate(90deg)'
    else downArrow.style.transform = 'rotate(0deg)'
}

/* Swith Dark and Light Mode */
const toggleColorMode = () => {
    const switchBall = document.getElementById('switchBall');

    darkMode = !darkMode;
    if(darkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        switchBall.style.transform = "translateX(0)"
        localStorage.setItem('theme', 'dark');
    } else { 
        document.documentElement.setAttribute('data-bs-theme', 'light');
        switchBall.style.transform = "translateX(2rem)"
        localStorage.setItem('theme', 'light');
    }
}

/* Open and Close Chatboard */
const toggleChatboard = () => {
    const chatMain = document.getElementById('chatboardMain');
    const chatOpenBtn = document.getElementById('chatboardOpenBtn');

    chatboardOpen = !chatboardOpen;
    if(chatboardOpen) {
        chatOpenBtn.classList.add('d-none');
        chatMain.classList.remove('d-none');
    } else {
        chatOpenBtn.classList.remove('d-none');
        chatMain.classList.add('d-none');
    }
}

// Handle User's Request 
const handleRequest = async () => {
    const chatHistory = document.getElementById('chatboardHistory')

    const inputData = document.getElementById('inputForm').value
    document.getElementById('inputForm').value = ""
    // My Open AI Key Here
    const OPENAI_KEY = "***"

    const reqDiv = document.createElement('div')
    reqDiv.textContent = inputData
    reqDiv.classList.add('request')
    chatHistory.appendChild(reqDiv)
    reqDiv.scrollIntoView({ behavior: "smooth", block: "end" });

    chat.push({type: 'request', content: inputData});

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_KEY}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: inputData}],
                max_tokens: 300
            })
        })

        const data = await response.json()
        outputData = data.choices[0].message.content
    } catch (error) {
        outputData = "I am very sorry. Open AI API is not working properly."
    } 
    
    const resDiv = document.createElement('div')
    resDiv.textContent = outputData
    resDiv.classList.add('response')
    chatHistory.appendChild(resDiv)
    resDiv.scrollIntoView({ behavior: "smooth", block: "end" });

    chat.push({type: 'response', content: outputData})
}

// chat autoload
document.addEventListener('DOMContentLoaded', function() {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-bs-theme', theme);

    const chatHistory = document.getElementById('chatboardHistory')
    chat.map((eachChat) => {
        if(eachChat.type == 'request'){
            const reqDiv = document.createElement('div')
            reqDiv.textContent = eachChat.content
            reqDiv.classList.add('request')
            chatHistory.appendChild(reqDiv)
            reqDiv.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            const resDiv = document.createElement('div')
            resDiv.textContent = eachChat.content
            resDiv.classList.add('response')
            chatHistory.appendChild(resDiv)
            resDiv.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    })
});

const adjustSize = (textarea) => {
    textarea.rows=1;
    textarea.style.height = 'auto';
    const currentRow = Math.min(textarea.scrollHeight / 24, 5)
    textarea.rows = currentRow;
}
