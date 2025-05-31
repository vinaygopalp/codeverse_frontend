import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import axiosInstance from "./utils/axiosConfig";

// Set axios as the default instance
axios.defaults = axiosInstance.defaults;

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
