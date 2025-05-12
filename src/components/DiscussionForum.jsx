import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const DiscussionForum = ({ problemName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    const fetchMessages = async () => {
      const formattedName = problemName.toLowerCase().replace(/\s+/g, "_");
      try {
        const res = await axios.get(
         `${import.meta.env.VITE_FETCH_MESSAGE}/${formattedName}`
        );
        const formattedMessages = res.data.map((msg) => ({
          sender: msg.user_name.username,
          message: msg.content,
          timestamp: msg.timestamp,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [problemName]);

  useEffect(() => {
    const formattedName = problemName.toLowerCase().replace(/\s+/g, "_");
    const socket = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}/${formattedName}/`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMsg = {
        sender: data.sender,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
    };

    return () => socket.close();
  }, [problemName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketRef.current.send(JSON.stringify({ message: newMessage, sender: username }));
      setNewMessage("");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-[#0e1117] text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">
        Discussion
      </h2>

      {messages.length === 0 ? (
        <div className="text-gray-400 italic mb-6">
          Be the first to start the discussion for this problem!
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto border border-[#1f2937] p-3 rounded">
          {messages.map((msg, index) => (
            <div key={index} className="bg-[#161b22] p-4 rounded hover:bg-[#1d232a] transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-blue-400">{msg.sender}</span>
                <span className="text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
              </div>
              <div className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-[#1d232a] border border-[#3b3f46] text-white p-2 rounded placeholder-gray-500 focus:outline-none"
          placeholder="Write your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Reply
        </button>
      </form>
    </div>
  );
};

export default DiscussionForum;
