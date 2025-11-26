import React, { useEffect, useState, useContext } from "react";
import { getConversation, sendMessage } from "../api/messages";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UsersList from "../components/UsersList";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { selectedChatUser } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!selectedChatUser) return;

    getConversation(selectedChatUser.id)
      .then(res => setMessages(res.data))
      .catch(err => console.log(err));
  }, [selectedChatUser]);

  const handleSend = () => {
    if (!text.trim() || !selectedChatUser) return;

    sendMessage({
      receiver_id: selectedChatUser.id,
      message: text,
    }).then(res => {
      setMessages([...messages, res.data]);
      setText("");
    }).catch(err => console.log(err));
  };

  return (
    <div className="chat-page" style={{ display: "flex" }}>
      <div style={{ width: "200px", borderRight: "1px solid gray" }}>
        <UsersList />
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        {!selectedChatUser ? (
          <p>Zgjidh një përdorues për të chat-uar</p>
        ) : (
          <>
            <h4>Chat me: {selectedChatUser.first_name} {selectedChatUser.last_name}</h4>

            <div className="messages" style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
              {messages.map(m => (
                <p key={m.id} style={{ textAlign: m.sender_id === user.id ? "right" : "left" }}>
                  {m.message}
                </p>
              ))}
            </div>

            <div className="send-box" style={{ marginTop: "10px" }}>
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Shkruaj mesazhin..." />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
