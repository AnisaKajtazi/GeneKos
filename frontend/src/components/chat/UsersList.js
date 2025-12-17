import React, { useState } from "react";
import '../../styles/chatpage.css';

const UserList = ({ users, selectUser = () => {}, unreadMessages = [], currentUser, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const hasUnread = (id) => unreadMessages.includes(id === "clinic" ? "clinic" : id);

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const ClinicIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );

  const OnlineIcon = () => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h3 className="user-list-title">
          <span className="icon-wrapper">
            <UserIcon />
          </span>
          Kontaktet
        </h3>
        <div className="user-count">
          {filteredUsers.length + (currentUser?.role === "user" ? 1 : 0)} kontakt{filteredUsers.length + (currentUser?.role === "user" ? 1 : 0) !== 1 ? 'e' : ''}
        </div>
      </div>

      <div className="user-search">
        <div className="search-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Kërkoni kontakte..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Kërkoni kontakte"
        />
        {searchTerm && (
          <button 
            className="search-clear" 
            onClick={() => setSearchTerm("")}
            aria-label="Pastro kërkimin"
          >
            ×
          </button>
        )}
      </div>

      <div className="users-scrollable">
        {currentUser?.role === "user" && (
          <div 
            className={`user-item clinic-item ${selectedUserId === "clinic" ? 'active' : ''}`}
            onClick={() => selectUser({ 
              id: "clinic", 
              first_name: "Klinika", 
              last_name: "GeneKos"
            })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && selectUser({ 
              id: "clinic", 
              first_name: "Klinika", 
              last_name: "GeneKos"
            })}
          >
            <div className="user-avatar clinic-avatar">
              <ClinicIcon />
            </div>
            <div className="user-info">
              <span className="user-name">Klinika GeneKos</span>
              <span className="user-role">Klinikë</span>
            </div>
            <div className="user-status">
              <div className="status-indicator online" title="Online">
                <OnlineIcon />
              </div>
              {hasUnread("clinic") && (
                <div className="unread-badge" title="Mesazhe të palexuar">
                  <span className="visually-hidden">Mesazhe të palexuar</span>
                </div>
              )}
            </div>
          </div>
        )}

        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className={`user-item ${selectedUserId === user.id ? 'active' : ''}`}
            onClick={() => selectUser(user)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && selectUser(user)}
          >
            <div className="user-avatar">
              {user.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">
                {user.first_name} {user.last_name}
              </span>
              <span className="user-role">{user.role === 'user' ? 'Pacient' : 'Doktor'}</span>
            </div>
            <div className="user-status">
              <div className="status-indicator online" title="Online">
                <OnlineIcon />
              </div>
              {hasUnread(user.id) && (
                <div className="unread-badge" title="Mesazhe të palexuar">
                  <span className="visually-hidden">Mesazhe të palexuar</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && currentUser?.role !== "user" && (
          <div className="no-users-found">
            <div className="no-users-icon">
              <UserIcon />
            </div>
            <p className="no-users-text">
              {searchTerm 
                ? `Nuk u gjet asnjë kontakt me "${searchTerm}"` 
                : 'Nuk ka kontakte të disponueshme'
              }
            </p>
          </div>
        )}
        

        {filteredUsers.length === 0 && currentUser?.role === "user" && searchTerm && (
          <div className="no-users-found">
            <div className="no-users-icon">
              <UserIcon />
            </div>
            <p className="no-users-text">
              Nuk u gjet asnjë kontakt me "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;