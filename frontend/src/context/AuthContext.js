import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);

    try {
      const decoded = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();

      setTimeout(() => {
        logout();
        alert("Session expired, please log in again");
      }, expiresIn);
    } catch (err) {
      console.error("Token decode failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
