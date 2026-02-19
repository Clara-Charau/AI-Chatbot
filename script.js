import { apiKey } from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

window.addEventListener("load", () => {
  const savedChat = localStorage.getItem("chatHistory");
  if (savedChat) chatBox.innerHTML = savedChat;
  chatBox.scrollTop = chatBox.scrollHeight;
});

function addMessage(message, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", className);
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot-message");
  typingDiv.textContent = "Chatbot is typing...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingDiv;
}

async function getBotResponse(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: userMessage,
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return (
        data?.error?.message || "An error occurred while fetching the response."
      );
    }
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't process your request."
    );
  } catch (error) {}
}

sendBtn.addEventListener("click", async () => {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;
  addMessage(userMessage, "user-message");
  userInput.value = "";

  const typingDiv = showTyping();

  const botResponse = await getBotResponse(userMessage);
  typingDiv.remove();
  addMessage(botResponse, "bot-message");

  localStorage.setItem("chatHistory", chatBox.innerHTML);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});
