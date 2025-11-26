import axios from "axios";

const API = "http://localhost:5000/api/messages";

export const getConversation = (receiverId) => {
  const token = localStorage.getItem("token"); 
  return axios.get(`${API}/conversation/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendMessage = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API}/send`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
