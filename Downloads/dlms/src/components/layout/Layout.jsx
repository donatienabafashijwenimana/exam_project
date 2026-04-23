import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLayout } from '../../context/LayoutContext';

export default function Layout({ darkMode, onThemeToggle }) {
  const { collapsed, mobileOpen, toggleCollapse, openMobile, closeMobile } = useLayout();
  const sideW = collapsed ? 68 : 255;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />
      <div style={{
        flex: 1, marginLeft: sideW, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
      }}
        className="layout-content"
      >
        <style>{`@media(max-width:768px){.layout-content{margin-left:0!important}}`}</style>
        <Header darkMode={darkMode} onThemeToggle={onThemeToggle} onMobileMenu={openMobile} />
        <main style={{ flex: 1, padding: '28px', animation: 'fadeUp 0.35s ease' }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(max-width:600px){main{padding:16px!important}}`}</style>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

