import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "antd";
// import { useAppSelector } from "../app/hooks";
// import { selectCurrentUser, selectIsAuthenticated } from "../features/auth/authSlice";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/chat-tutor", label: "AI Chat Tutor" },
];

export default function Navbar() {
  const navigate = useNavigate();
//   const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthenticated = false;
//   const user = useAppSelector(selectCurrentUser);

//   const dashboardPath = user?.role === "admin" ? "/admin" : "/student";
  const dashboardPath ="/admin";

  return (
    <nav className="site-nav">
      <div className="site-nav-brand" onClick={() => navigate("/")}>
        <span className="site-nav-dot" />
        AI Learning Coach
      </div>

      <div className="site-nav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              "site-nav-link" + (isActive ? " active" : "")
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="site-nav-actions">
        {isAuthenticated ? (
          <Button type="primary" onClick={() => navigate(dashboardPath)}>
            Dashboard
          </Button>
        ) : (
          <>
            <Button type="text" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Get started
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
