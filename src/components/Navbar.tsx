// import { NavLink, useNavigate } from "react-router-dom";
// import { Button } from "antd";
// // import { useAppSelector } from "../app/hooks";
// // import { selectCurrentUser, selectIsAuthenticated } from "../features/auth/authSlice";
// import "./Navbar.css";

// const links = [
//   { to: "/", label: "Home" },
//   { to: "/about", label: "About" },
//   { to: "/features", label: "Features" },
//   { to: "/chat-tutor", label: "AI Chat Tutor" },
// ];

// export default function Navbar() {
//   const navigate = useNavigate();
// //   const isAuthenticated = useAppSelector(selectIsAuthenticated);
//   const isAuthenticated = false;
// //   const user = useAppSelector(selectCurrentUser);

// //   const dashboardPath = user?.role === "admin" ? "/admin" : "/student";
//   const dashboardPath ="/admin";

//   return (
//     <nav className="site-nav">
//       <div className="site-nav-brand" onClick={() => navigate("/")}>
//         <span className="site-nav-dot" />
//         AI Learning Coach
//       </div>

//       <div className="site-nav-links">
//         {links.map((l) => (
//           <NavLink
//             key={l.to}
//             to={l.to}
//             end={l.to === "/"}
//             className={({ isActive }) =>
//               "site-nav-link" + (isActive ? " active" : "")
//             }
//           >
//             {l.label}
//           </NavLink>
//         ))}
//       </div>

//       <div className="site-nav-actions">
//         {isAuthenticated ? (
//           <Button type="primary" onClick={() => navigate(dashboardPath)}>
//             Dashboard
//           </Button>
//         ) : (
//           <>
//             <Button type="text" onClick={() => navigate("/login")}>
//               Log in
//             </Button>
//             <Button type="primary" onClick={() => navigate("/register")}>
//               Get started
//             </Button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Drawer, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
// import { useAppSelector } from "../redux/hooks";
// import {
//   selectCurrentUser,
//   selectIsAuthenticated,
// } from "../redux/api/features/auth/authSlice";

import "./Navbar.css";

const { useBreakpoint } = Grid;

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/chat-tutor", label: "AI Chat Tutor" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [open, setOpen] = useState(false);

  // Replace with Redux later
  const isAuthenticated = false;
  // const user = useAppSelector(selectCurrentUser);
  // const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const dashboardPath = "/admin";
  // const dashboardPath = user?.role === "admin" ? "/admin" : "/student";

  return (
    <>
      <nav className="site-nav">
        <div className="site-nav-brand" onClick={() => navigate("/")}>
          <span className="site-nav-dot" />
          AI Learning Coach
        </div>

        {/* Desktop Navigation */}
        {screens.md && (
          <>
            <div className="site-nav-links">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `site-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="site-nav-actions">
              {isAuthenticated ? (
                <Button
                  type="primary"
                  onClick={() => navigate(dashboardPath)}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button onClick={() => navigate("/login")}>
                    Log in
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => navigate("/register")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        )}
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title="AI Learning Coach"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: "none",
                fontSize: 16,
              }}
            >
              {link.label}
            </NavLink>
          ))}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {isAuthenticated ? (
              <Button
                type="primary"
                block
                onClick={() => {
                  navigate(dashboardPath);
                  setOpen(false);
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  block
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                >
                  Log in
                </Button>

                <Button
                  type="primary"
                  block
                  onClick={() => {
                    navigate("/register");
                    setOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}