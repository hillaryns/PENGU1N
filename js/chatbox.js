const toggleBtn = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const closeBtn = document.getElementById("chat-close");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

// OPENROUTER API KEY
const API_KEY = "";

toggleBtn.onclick = () => {
  chatBox.style.display =
    chatBox.style.display === "flex" ? "none" : "flex";
};

closeBtn.onclick = () => {
  chatBox.style.display = "none";
};

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;

  const p = document.createElement("p");
  p.innerText = text;

  msg.appendChild(p);
  messages.appendChild(msg);

  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  // USER MESSAGE
  addMessage(text, "user-message");

  input.value = "";

  // TYPING MESSAGE
  addMessage("Typing...", "bot-message");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "system",
              content: `
You are the official AI assistant for PENGU1N learning hub.

Your ONLY purpose is to help users understand and navigate the LEARNING HUB website and to help the users feel safe and supported.

ABOUT LEARNING HUB:
-CREATED BY PENGU1N / HALCYON
- LEARNING HUB is an online learning platform for students.
- Users can learn programming and tech subjects.
- The platform contains:
  - Dashboard
  - Subjects
  - Notes
  - Practice
  - Tests
  - Classes
  - Internships
  - Profile section

YOUR JOB:
- Help users navigate the website.
- a little chit chat is fine, but STAY ON TOPIC.
- Tell users where features are located.
- Explain how to use sections of the platform.
- Answer ONLY questions related to LEARNING HUB.
- If a question is unrelated, politely say:
  "I am designed only to help with the PENGU1N Learning hub website, for further assistance, please contact Halcyon."

STYLE:
- Friendly
- Short responses
- Helpful
- Modern website assistant tone
`
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL RESPONSE:", data);

    // REMOVE TYPING MESSAGE
    messages.removeChild(messages.lastChild);

    let botReply =
      data.choices?.[0]?.message?.content ||
      "AI failed to respond.";

    if (data.error) {
      botReply = "ERROR: " + data.error.message;
    }

    addMessage(botReply, "bot-message");

  } catch (error) {
    console.error("FETCH ERROR:", error);

    messages.removeChild(messages.lastChild);

    addMessage("Error connecting to OpenRouter 😭", "bot-message");
  }
}