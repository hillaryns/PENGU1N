import { useState } from 'react';

const FALLBACK_REPLY =
  'I am designed only to help with the PENGU1N Learning hub website. For further assistance, please contact Halcyon.';

export default function Chatbox() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 How can I help you today?' },
  ]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'bot', text: 'Typing...' }]);
    setInput('');

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    try {
      let botReply = FALLBACK_REPLY;

      if (apiKey) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are the official AI assistant for PENGU1N learning hub. Help users navigate Dashboard, Subjects, Notes, Practice, Tests, Classes, Internships, and Profile. Stay on topic.',
              },
              { role: 'user', content: text },
            ],
          }),
        });
        const data = await response.json();
        botReply = data.choices?.[0]?.message?.content || data.error?.message || FALLBACK_REPLY;
      }

      setMessages((prev) => {
        const next = [...prev];
        next.pop();
        next.push({ role: 'bot', text: botReply });
        return next;
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next.pop();
        next.push({ role: 'bot', text: 'Error connecting to assistant. Try again later.' });
        return next;
      });
    }
  };

  return (
    <div className="chatbox-container">
      <button
        type="button"
        id="chat-toggle"
        className="chat-toggle-btn"
        onClick={() => setOpen((value) => !value)}
      >
        <i className="fas fa-comments" />
        <span className="chat-badge">1</span>
      </button>

      {open && (
        <div id="chat-box" className="chat-box" style={{ display: 'flex' }}>
          <div className="chat-header">
            <h3>Quick Chat</h3>
            <button type="button" id="chat-close" className="chat-close-btn" onClick={() => setOpen(false)}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div id="chat-messages" className="chat-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`${msg.role}-message`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              id="chat-input"
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button type="button" id="send-btn" className="chat-send-btn" onClick={sendMessage}>
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
