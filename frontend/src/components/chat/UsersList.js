import React from "react";

const UserList = ({ users, selectUser = () => {}, unreadMessages = [] }) => {
  const hasUnread = (id) => unreadMessages.includes(id === "clinic" ? "clinic" : id);

  return (
    <div className="user-list">
      <h4>Users</h4>
      {(users || []).map(u => (
        <div key={u.id} onClick={() => selectUser(u)} style={{ position: "relative" }}>
          {u.first_name} {u.last_name}
          {hasUnread(u.id) && <span style={{ color: "red", marginLeft: 5 }}>•</span>}
        </div>
      ))}
      <div onClick={() => selectUser({ id: "clinic", fullName: "Clinic" })} style={{ position: "relative" }}>
        Clinic
        {hasUnread("clinic") && <span style={{ color: "red", marginLeft: 5 }}>•</span>}
      </div>
    </div>
  );
};



export default UserList;
