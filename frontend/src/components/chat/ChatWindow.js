import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../context/SocketContext";
import axios from "axios";

const ChatWindow = ({ user, currentUser }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersMap, setUsersMap] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const map = {};
        res.data.forEach(u => {
          map[u.id] = { first_name: u.first_name, last_name: u.last_name };
        });
        setUsersMap(map);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const userId = user.id === "clinic" ? "clinic" : user.id;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/conversation/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [socket]);

  const sendMessage = async () => {
    if (!text) return;

    const msg = { to: user.id, message: text };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        msg,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("sendMessage", res.data);
      setMessages(prev => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", height: "100%" }}>
      <h4 style={{ marginBottom: "10px" }}>
        Chat with {user.id === "clinic" ? "Clinic" : `${user.first_name} ${user.last_name}`}
      </h4>

      <div style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        flex: 1,
        overflowY: "auto",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9"
      }}>
        {messages.map((m, i) => {
          const isCurrentUser = m.senderId === currentUser.id;
          const align = isCurrentUser ? "right" : "left";

          let senderName = "Clinic";
          if (m.senderId && usersMap[m.senderId]) {
            senderName = `${usersMap[m.senderId].first_name} ${usersMap[m.senderId].last_name}`;
          } else if (isCurrentUser) {
            senderName = "You";
          }

          return (
            <div key={i} style={{ textAlign: align, marginBottom: "8px" }}>
              <div style={{ fontSize: "0.75em", color: "#555", marginBottom: "2px" }}>
                {senderName}
              </div>
              <span style={{
                backgroundColor: isCurrentUser ? "#DCF8C6" : "#FFF",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "inline-block",
                maxWidth: "70%",
                wordBreak: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {m.content}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          style={{ padding: "8px 15px", borderRadius: "5px", border: "none", backgroundColor: "#4CAF50", color: "#fff" }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
