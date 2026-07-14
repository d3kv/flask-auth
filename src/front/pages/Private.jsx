import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Private = () => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const validate = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          sessionStorage.removeItem("token");
          dispatch({ type: "logout" });
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        navigate("/login");
      }
    };

    validate();
  }, []);

  if (!user) return null;

  return (
    <div className="container text-center my-5">
      <h1 className="display-5">Private area</h1>
      <div className="alert alert-success mt-4">
        Welcome, <strong>{user.email}</strong>. You are logged in.
      </div>
    </div>
  );
};
