import React, { useState, useEffect, useContext } from "react";
import { SocketProvider } from "../../context/SocketContext";
import UserList from "../../components/chat/UsersList";
import ChatWindow from "../../components/chat/ChatWindow";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const ChatPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/unread",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setUnreadMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchUnread();
  }, [currentUser]);

  return (
    <SocketProvider user={currentUser}>
      <div style={{ display: "flex" }}>
        {currentUser.role === "clinic" && (
          <UserList 
            users={users} 
            selectUser={setSelectedUser} 
            unreadMessages={unreadMessages} 
          />
        )}

        {currentUser.role === "user" && (
          <UserList 
            users={[]} 
            selectUser={u => setSelectedUser({ id: "clinic", fullName: "Clinic" })}
            unreadMessages={unreadMessages} 
          />
        )}

        {selectedUser && (
          <ChatWindow user={selectedUser} currentUser={currentUser} />
        )}
      </div>
    </SocketProvider>
  );
};

export default ChatPage;
