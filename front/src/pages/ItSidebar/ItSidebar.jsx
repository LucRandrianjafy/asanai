import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaUserGraduate, 
  FaSignOutAlt,
  FaBars,
  FaClipboardList,
  FaTimes
} from "react-icons/fa";
import styles from "./ItSidebar.module.css";

const ItSidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { path: "/adminit/candidat", icon: FaUserGraduate, label: "Candidat" },
    { path: "/adminit/overview", icon: FaClipboardList, label: "Test technique" }
  ];

  const handleCloseSidebar = () => setOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="d-md-none p-2">
        <button
          className={`btn btn-outline-light ${styles.mobileToggle}`}
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <FaBars className="me-2" />
          <span>Admin IT</span>
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        {/* Header Section */}
        <header className={styles.sidebarHeader}>
          <h1 className={styles.logo}>ADMIN IT</h1>
          <button 
            className={`${styles.closeBtn} d-md-none`}
            onClick={handleCloseSidebar}
            aria-label="Fermer le menu"
          >
            <FaTimes />
          </button>
        </header>

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
                onClick={handleCloseSidebar}
              >
                <Icon className={styles.icon} />
                <span className={styles.linkText}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <NavLink
            to="/login"
            className={styles.logout}
            onClick={handleCloseSidebar}
          >
            <FaSignOutAlt className={styles.icon} />
            <span className={styles.linkText}>Se déconnecter</span>
          </NavLink>
        </footer>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div 
          className={styles.overlay} 
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default ItSidebar;