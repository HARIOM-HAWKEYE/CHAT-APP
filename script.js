document.addEventListener("DOMContentLoaded", () => {
    const chatList = document.getElementById("chatList");
    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendBtn");
    const chatName = document.getElementById("chatName");
    const chatStatus = document.getElementById("chatStatus");
    const chatAvatar = document.getElementById("chatAvatar");

    let activeChatId = null;
    let chatData = [];

    // Load chat data
    const storedData = localStorage.getItem("chatData");
    if (storedData) {
        chatData = JSON.parse(storedData);
        displayChatList();
    }

    function displayChatList() {
        chatList.innerHTML = "";
        chatData.forEach(chat => {
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.dataset.id = chat.id;

            chatItem.innerHTML = `
                <img src="${chat.avatar}" alt="${chat.name}">
                <div class="chat-info">
                    <span class="name">${chat.name}</span>
                    <span class="status">${chat.status}</span>
                </div>
            `;

            chatItem.addEventListener("click", () => selectChat(chat.id));
            chatList.appendChild(chatItem);
        });
    }

    function selectChat(chatId) {
        activeChatId = chatId;
        const chat = chatData.find(c => c.id === chatId);
        if (!chat) return;

        chatName.innerText = chat.name;
        chatStatus.innerText = chat.status;
        chatAvatar.src = chat.avatar;

        displayMessages(chat.messages);
    }

    function displayMessages(messages) {
        chatMessages.innerHTML = "";
        messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", msg.sender === "You" ? "you" : "other");
            messageDiv.innerText = msg.text;
            chatMessages.appendChild(messageDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text || !activeChatId) return;

        const chat = chatData.find(c => c.id === activeChatId);
        chat.messages.push({ sender: "You", text });

        displayMessages(chat.messages);
        messageInput.value = "";

        localStorage.setItem("chatData", JSON.stringify(chatData));
    }

    // RGB Color Picker
    function changeChatColor() {
        const color = prompt("Enter an RGB color (e.g., rgb(255, 0, 0)):");
        if (color) {
            document.querySelector(".chat-box").style.backgroundColor = color;
        }
    }

    window.changeChatColor = changeChatColor;
});
