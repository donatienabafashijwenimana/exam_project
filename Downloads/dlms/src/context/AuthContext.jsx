import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');

  const login = (email, password) => {
    let allUsers = USERS;
    try {
      const saved = localStorage.getItem('dlms_users');
      if (saved) allUsers = JSON.parse(saved);
    } catch {}
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      try { localStorage.setItem('dlms_user', JSON.stringify(found)); } catch {}
      setError('');
      return { ok: true, role: found.role };
    }
    setError('Invalid email or password.');
    return { ok: false };
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('dlms_user'); } catch {}
  };

  const can = (permission) => {
    if (!user) return false;
    if (!permission) return true;
    if (user.role === 'admin' && user.permissions?.includes('all')) return true;
    return user.permissions?.includes(permission);
  };

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('dlms_user', JSON.stringify(user));
      } catch (e) {
        console.warn('localStorage save failed:', e);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
