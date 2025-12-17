import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import UserList from "../../components/chat/UsersList";
import ChatWindow from "../../components/chat/ChatWindow";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import '../../styles/chatpage.css';

const ChatPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      try {
        const usersRes = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const filteredUsers = usersRes.data.filter(u => u.id !== currentUser.id);
        setUsers(filteredUsers);

        const unreadRes = await axios.get(
          "http://localhost:5000/api/messages/unread",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadMessages(unreadRes.data.map(msg => msg.senderId));
      } catch (err) {
        console.error("Error fetching chat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      try {
        const unreadRes = await axios.get(
          "http://localhost:5000/api/messages/unread",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadMessages(unreadRes.data.map(msg => msg.senderId));
      } catch (err) {
        console.error("Error refreshing unread messages:", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.receiverId === currentUser.id) {
        setUnreadMessages(prev => [...prev, message.senderId]);
      }
    };

    socket.on("receiveMessage", handleNewMessage);
    return () => socket.off("receiveMessage", handleNewMessage);
  }, [socket, currentUser.id]);

  const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const OnlineIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="6" cy="6" r="6" />
    </svg>
  );

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-content">
          <div className="chat-logo">
            <button 
              className="mobile-menu-button" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <div className="chat-icon">
              <ChatIcon />
            </div>
            <h1 className="chat-title">Chat</h1>
          </div>
          <div className="chat-status">
            <div className="status-indicator">
              <OnlineIcon />
              <span className="status-text">Online</span>
            </div>
          </div>
        </div>
        <p className="chat-subtitle">
          {currentUser.role === "clinic" 
            ? "Komunikoni në kohë reale me pacientët" 
            : "Komunikoni me klinikën tuaj"}
        </p>
      </header>

      <div className="chat-container">
        <div className={`chat-sidebar ${sidebarOpen ? 'active' : ''}`}>
          {loading ? (
            <div className="sidebar-loading">
              <div className="loading-spinner"></div>
              <p>Duke ngarkuar kontaktet...</p>
            </div>
          ) : (
            <>
              <UserList 
                users={users} 
                selectUser={(user) => {
                  setSelectedUser(user);
                  setSidebarOpen(false);
                }} 
                unreadMessages={unreadMessages}
                currentUser={currentUser}
                selectedUserId={selectedUser?.id}
              />
              
              <div className="chat-info">
                <p className="info-text">
                  <strong>Tip:</strong> Klikoni në një kontakt për të filluar bisedën
                </p>
              </div>
            </>
          )}
        </div>

        <div className="chat-main">
          {selectedUser ? (
            <ChatWindow 
              user={selectedUser} 
              currentUser={currentUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <div className="chat-welcome">
              <div className="welcome-icon">
                <ChatIcon />
              </div>
              <h2 className="welcome-title">Mirë se vini në Chat</h2>
              <p className="welcome-message">
                {currentUser.role === "clinic"
                  ? "Zgjidhni një pacient për të filluar bisedën"
                  : "Zgjidhni Klinikën GeneKos për të filluar bisedën"}
              </p>
              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">💬</span>
                  <span className="feature-text">Komunikim në kohë reale</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span className="feature-text">Fjalime të sigurta dhe private</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📁</span>
                  <span className="feature-text">Histori e plotë e bisedave</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;