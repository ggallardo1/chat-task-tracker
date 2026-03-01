import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  async function fetchTasks() {
    const res = await axios.get("http://localhost:3000/tasks");
    setTasks(res.data);
  }

  async function sendMessage() {
    const res = await axios.post("http://localhost:3000/chat", {
      message
    });

    setChat([...chat, `You: ${message}`, `AI: ${res.data.reply}`]);
    setMessage("");
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ width: "40%", padding: 20, borderRight: "1px solid #ddd" }}>
        <h2>Tasks</h2>
        {tasks.map((t) => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <strong>{t.title}</strong>
            <div>Status: {t.status}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Chat</h2>
        <div style={{ height: "70%", overflowY: "auto", marginBottom: 10 }}>
          {chat.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "80%" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
