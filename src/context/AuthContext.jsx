import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    userId: null,
    username: null,
    roles: []
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (storedToken) {
      // Verify token validity by making a test request
      axiosInstance.get(`${import.meta.env.VITE_BE_URL}/api/verify-token`)
        .then(() => {
          console.log("AuthProvider mounted with valid token");
          setToken(storedToken);
          setUserData({
            userId: storedUserId,
            username: storedUsername,
            roles: storedRoles
          });
          setIsAuthenticated(true);
        })
        .catch(() => {
          console.log("AuthProvider mounted with invalid token");
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          localStorage.removeItem("roles");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("AuthProvider mounted without token");
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const { token, user_id, username, roles } = userData;
    
    // Store all data in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user_id);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", JSON.stringify(roles));
    
    // Update state
    setToken(token);
    setUserData({
      userId: user_id,
      username: username,
      roles: roles
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    
    // Reset state
    setToken(null);
    setUserData({
      userId: null,
      username: null,
      roles: []
    });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, token, userData, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
