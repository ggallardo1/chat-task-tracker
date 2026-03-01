import { useEffect, useState } from "react";
import axios from "axios";
import { TaskCard } from "./components/TaskElements";

export default function App() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        const res = await axios.get("http://localhost:3000/tasks");
        setTasks(res.data);
    };

    const handleReset = async () => {
        if (confirm("Reset system to clean slate?")) {
            await axios.post("http://localhost:3000/admin/reset");
            setChat([]);
            fetchTasks();
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userText = message;
        setMessage("");
        setChat(prev => [...prev, { role: "You", text: userText }]);
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:3000/chat", { message: userText });
            setChat(prev => [...prev, { role: "AI", text: res.data.reply }]);
            fetchTasks();
        } catch (e) {
            setChat(prev => [...prev, { role: "Error", text: "Connection failed." }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f1f5f9', color: '#334155', fontFamily: 'system-ui, sans-serif' }}>
        
            {/* LEFT: Task List View */}
            <div style={{ width: '400px', borderRight: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Tasks</h2>
                    <button onClick={handleReset} style={{ fontSize: '10px', color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>
                        RESET (S5)
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f8fafc' }}>
                    {tasks.map(t => <TaskCard key={t.id} task={t} />)}
                </div>
            </div>

            {/* RIGHT: Chat Interface */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {chat.map((c, i) => (
                        <div key={i} style={{ 
                        marginBottom: '15px', 
                        textAlign: c.role === "You" ? 'right' : 'left' 
                        }}>
                            <div style={{ 
                                display: 'inline-block', 
                                padding: '10px 15px', 
                                borderRadius: '12px',
                                maxWidth: '70%',
                                backgroundColor: c.role === "You" ? '#2563eb' : '#f1f5f9',
                                color: c.role === "You" ? '#fff' : '#1e293b',
                                fontSize: '14px'
                            }}>
                                <strong>{c.role}:</strong> {c.text}
                            </div>
                        </div>
                    ))}
                    {loading && <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI is processing...</div>}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                    <input 
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        placeholder="Talk to the assistant..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button 
                        onClick={sendMessage}
                        style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
