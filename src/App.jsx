import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
