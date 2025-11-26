import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";

const UsersList = () => {
  const { setSelectedChatUser } = useContext(ChatContext);

  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  axios.get("http://localhost:5000/api/users") 
    .then(res => setAllUsers(res.data))
    .catch(err => console.log(err));
}, []);


  const filteredUsers = allUsers.filter(u =>
    u.first_name.toLowerCase().startsWith(search.toLowerCase()) ||
    u.last_name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div>
      <h4>Përdoruesit</h4>
      <input
        type="text"
        placeholder="Kërko pacientin..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
      />

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {filteredUsers.map(u => (
          <div
            key={u.id}
            onClick={() => setSelectedChatUser(u)}
            style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ccc" }}
          >
            {u.first_name} {u.last_name}
          </div>
        ))}
        {filteredUsers.length === 0 && <p>Nuk u gjet asnjë pacient</p>}
      </div>
    </div>
  );
};

export default UsersList;
