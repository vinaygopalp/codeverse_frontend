import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
// import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Signup from "../pages/Signup";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const AppRoutes = () => {
  //   const isAuthenticated = !!localStorage.getItem("token");
  const { isAuthenticated, loading } = useAuth();
  if (!loading) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Route>

        <Route
          path="*"
          element={
            <div className="text-center mt-10 text-xl text-gray-700">
              Page Not Found
            </div>
          }
        />
      </Routes>
    );
  } else {
    return <span className="loading loading-ring loading-xl"></span>;
  }
};

export default AppRoutes;
