import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container">
        <Link to="/" className="text-decoration-none">
          <span className="navbar-brand mb-0 h1">Auth Demo</span>
        </Link>
        <div className="d-flex gap-2">
          {store.token ? (
            <>
              <Link to="/private">
                <button className="btn btn-outline-primary">Private</button>
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-outline-primary">Log in</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-primary">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
