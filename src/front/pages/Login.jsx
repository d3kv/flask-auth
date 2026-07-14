import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not log in");
        return;
      }

      sessionStorage.setItem("token", data.token);
      dispatch({ type: "login", payload: { token: data.token, user: data.user } });
      navigate("/private");
    } catch {
      setError("Could not reach the server");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "420px" }}>
      <h1 className="text-center my-4">Log in</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Log in</button>
      </form>
      <p className="text-center mt-3">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};
