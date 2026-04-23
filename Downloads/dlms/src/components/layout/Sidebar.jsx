import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Avatar, Chip, IconButton, Tooltip,
  Typography
} from '@mui/material';
import {
  Dashboard, Assignment, People, BarChart, Schedule, PersonAdd,
  Logout, ChevronLeft, ChevronRight, TrendingUp, CalendarMonth,
  CarCrash, DirectionsCar,
  CarCrashRounded,
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLayout } from '../../context/LayoutContext';
import './Sidebar.scss';

const PERMISSION_ROUTES = {
  dashboard: { icon: <Dashboard />, text: 'Dashboard', permission: null },
  progress: { icon: <TrendingUp />, text: 'My Progress', permission: 'view_progress' },
  view_progress: { icon: <BarChart />, text: 'View Progress', permission: 'view_progress' },
  schedule: { icon: <CalendarMonth />, text: 'My Schedule', permission: 'view_schedule' },
  assigned: { icon: <People />, text: 'Assigned Learners', permission: 'view_assigned_learners' },
  availability: { icon: <Schedule />, text: 'Availability', permission: 'manage_availability' },
  update_progress: { icon: <Assignment />, text: 'Progress', permission: 'update_progress' },
  manage_learners: { icon: <People />, text: 'Manage Learners', permission: 'manage_learners', badge: 'pending' },
  manage_instructors: { icon: <People />, text: 'Manage Instructors', permission: 'manage_instructors' },
  manage_vehicles: { icon: <DirectionsCar />, text: 'Manage Vehicles', permission: 'manage_vehicles' },
  schedule_lessons: { icon: <Schedule />, text: 'Schedule Lessons', permission: 'schedule_lessons' },
  analytics: { icon: <BarChart />, text: 'Analytics', permission: 'view_analytics' },
};

const ROLE_PATHS = {
    learner: {
      base: '/learner',
      routes: ['dashboard', 'progress', 'schedule', 'view_progress']
    },
  instructor: {
    base: '/instructor',
    routes: ['dashboard', 'assigned', 'my_availability', 'update_progress']
  },
  admin: {
    base: '/admin',
    routes: ['dashboard', 'manage_learners', 'manage_instructors', 'manage_vehicles', 'schedule_lessons', 'analytics']
  },
};

export default function Sidebar({ collapsed: propCollapsed, onToggle: propOnToggle, mobileOpen, onMobileClose }) {
  const { user, logout, can } = useAuth();
  const { learners } = useApp();
  const { collapsed: contextCollapsed, toggleCollapse } = useLayout();
  const navigate = useNavigate();

  const collapsed = contextCollapsed;
  const onToggle = toggleCollapse;

  const buildNav = () => {
    if (!user?.role || !ROLE_PATHS[user.role]) return [];

    const roleConfig = ROLE_PATHS[user.role];
    const permittedRoutes = roleConfig.routes.filter(routeKey => {
      const route = PERMISSION_ROUTES[routeKey];
      if (!route) return false;
      return route.permission ? can(route.permission) : true;
    });

    return [{
      section: 'Main',
      items: permittedRoutes.map(routeKey => {
        const route = PERMISSION_ROUTES[routeKey];
        const to = `${roleConfig.base}/${routeKey}`;
        return { to, icon: route.icon, text: route.text, badge: route.badge };
      })
    }];
  };

  const nav = buildNav();
  const pendingLearners = learners?.filter(l => !l.assignedInstructor) || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div className="overlay" onClick={onMobileClose} />
      )}

      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}
      >
        <div className="brand" >
          <DirectionsCar fontSize="large" />
          {!collapsed && <Typography sx={{fontSize:"30px"}} >DSMS</Typography>}

          <IconButton onClick={onToggle} size="small">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>

        <nav className="nav">
          {nav.map(section => (
            <div key={section.section}>
              {!collapsed && (
                <div className="section">{section.section}</div>
              )}

              {section.items.map(item => (
                <Tooltip key={item.to} title={collapsed ? item.text : ''} placement="right">
                  <NavLink to={item.to} onClick={onMobileClose} >
                    {({ isActive }) => (
                      <div
                        className={`item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
                      >
                        {item.icon}
                        {!collapsed && <label   sx={{textDecoration:"none"}}>{item.text}</label>}

                        
                      </div>
                    )}
                  </NavLink>
                </Tooltip>
              ))}
            </div>
          ))}
        </nav>

        <div className="footer">
          <div className="user">
            <Avatar>{user?.name?.[0]}</Avatar>

            {!collapsed && (
              <div>
                <div>{user?.name}</div>
                <small>{user.role?.toUpperCase()}</small>
              </div>
            )}

            <IconButton onClick={handleLogout}>
              <Logout fontSize="small" />
            </IconButton>
          </div>
        </div>
      </aside>
    </>
  );
}
