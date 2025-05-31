import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import axiosInstance from "./utils/axiosConfig";

// Make the configured axios instance available globally
window.axios = axiosInstance;

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
