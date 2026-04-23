import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_sidebar');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(c => {
    const newVal = !c;
    try {
      localStorage.setItem('dlms_sidebar', JSON.stringify(newVal));
    } catch {}
    return newVal;
  });

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <LayoutContext.Provider value={{ collapsed, mobileOpen, toggleCollapse: toggleCollapse, openMobile, closeMobile }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);

