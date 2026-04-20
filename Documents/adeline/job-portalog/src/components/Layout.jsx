import React, { useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import styles from "../scss/Sidebar.module.scss";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: "flex" }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={styles.layout__main}>
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
