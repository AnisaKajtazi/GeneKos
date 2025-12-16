import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../context/SocketContext";
import axios from "axios";
import '../../styles/chatpage.css';

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );

  const OnlineIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <circle cx="5" cy="5" r="5" />
    </svg>
  );

  if (!user) {
    return (
      <div className="chat-welcome">
        <div className="welcome-icon">💬</div>
        <h2 className="welcome-title">Zgjidhni një kontakt</h2>
        <p className="welcome-message">Zgjidhni një kontakt nga lista për të filluar bisedën</p>
      </div>
    );
  }

  const userDisplayName = user.id === "clinic" 
    ? "Klinika GeneKos"
    : `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <div className="chat-partner-info">
          <div className="partner-avatar">
            {userDisplayName[0]?.toUpperCase() || 'U'}
          </div>
          <div className="partner-details">
            <h3 className="partner-name">{userDisplayName}</h3>
            <div className="partner-status">
              <OnlineIcon />
              <span className="status-text">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <h4>Nuk ka mesazhe</h4>
            <p>Bisedoni me {userDisplayName} për të filluar një bisedë të re</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              
              let senderName = "Klinika";
              if (message.senderId && usersMap[message.senderId]) {
                senderName = `${usersMap[message.senderId].first_name} ${usersMap[message.senderId].last_name}`;
              } else if (isCurrentUser) {
                senderName = "Ju";
              }

              return (
                <div 
                  key={message._id || index} 
                  className={`message-wrapper ${isCurrentUser ? 'sent' : 'received'}`}
                >
                  <div className="message-sender">{senderName}</div>
                  <div className="message-bubble">
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.createdAt || Date.now()).toLocaleTimeString('sq-AL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="message-input-container">
        <div className="input-wrapper">
          <textarea
            className="message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Shkruani mesazhin tuaj këtu..."
            rows={1}
          />
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={!text.trim()}
          >
            <SendIcon />
          </button>
        </div>
        <p className="input-hint">
          Shtypni <kbd>Enter</kbd> për të dërguar, <kbd>Shift + Enter</kbd> për rresht të ri
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;