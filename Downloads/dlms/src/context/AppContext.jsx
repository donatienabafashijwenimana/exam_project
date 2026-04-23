import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LEARNERS, INITIAL_LESSONS, USERS, INITIAL_VEHICLES } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [learners, setLearners] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_learners');
      return saved ? JSON.parse(saved) : INITIAL_LEARNERS;
    } catch {
      return INITIAL_LEARNERS;
    }
  });

  const [lessons, setLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_lessons');
      return saved ? JSON.parse(saved) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  });

const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_users');
      return saved ? JSON.parse(saved) : USERS;
    } catch {
      return USERS;
    }
  });

  const instructors = users.filter(u => u.role === 'instructor');

  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('dlms_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('dlms_learners', JSON.stringify(learners)); } catch (e) { console.warn('localStorage save failed:', e); }
  }, [learners]);

  useEffect(() => {
    try { localStorage.setItem('dlms_lessons', JSON.stringify(lessons)); } catch (e) { console.warn('localStorage save failed:', e); }
  }, [lessons]);

  useEffect(() => {
    try { localStorage.setItem('dlms_users', JSON.stringify(users)); } catch (e) { console.warn('localStorage save failed:', e); }
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem('dlms_vehicles', JSON.stringify(vehicles)); } catch (e) { console.warn('localStorage save failed:', e); }
  }, [vehicles]);

  const addLearner = (learnerData) => {
    const id = `L${String(learners.length + 1).padStart(3, '0')}`;
    const normalizedData = learnerData.learnerName
      ? { ...learnerData, name: learnerData.learnerName }
      : learnerData;
    const newLearner = { id, ...normalizedData };
    setLearners(prev => [...prev, newLearner]);
    return id;
  };

  const updateLearner = (id, data) => {
    setLearners(prev => prev.map(l => {
      if (l.id === id) {
        const updated = { ...l, ...data };
        if (updated.performance !== undefined && updated.performance > 100) {
          updated.performance = 100;
        }
        if (updated.hoursCompleted !== undefined && updated.totalHours !== undefined) {
          updated.hoursCompleted = Math.min(updated.hoursCompleted, updated.totalHours);
        }
        return updated;
      }
      return l;
    }));
  };

  const deleteLearner = (id) => setLearners(prev => prev.filter(l => l.id !== id));

  const addLesson = (lessonData) => {
    const id = `LESS${String(lessons.length + 1).padStart(3, '0')}`;
    const newLesson = { id, ...lessonData };
    setLessons(prev => [...prev, newLesson]);
    return id;
  };

  const updateLesson = (id, data) => setLessons(prev => prev.map(ls => ls.id === id ? { ...ls, ...data } : ls));

  const deleteLesson = (id) => setLessons(prev => prev.filter(ls => ls.id !== id));

  const addUser = (userData) => {
    const maxId = Math.max(...users.map(u => u.id), 0);
    const newUser = { 
      id: maxId + 1,
      role: 'learner',
      ...userData,
      permissions: ['register', 'view_progress', 'view_schedule']
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const updateUser = (id, data) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));

  const addInstructor = (data) => {
    const maxId = Math.max(...users.map(u => u.id), 0);
    const newInstructor = {
      id: maxId + 1,
      role: 'instructor',
      ...data,
      permissions: ['view_assigned_learners', 'update_progress', 'manage_availability'],
    };
    setUsers(prev => [...prev, newInstructor]);
  };

  const deleteInstructor = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const updateInstructor = (id, data) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));

  const addLearnerWithAccount = (learnerData, password) => {
    const user = addUser({
      name: learnerData.learnerName,
      email: learnerData.email,
      password: password || 'learner123',
      avatar: learnerData.learnerName.split(' ').map(n => n[0]).join('').slice(0, 2),
      badge: 'Student',
    });
    const learnerId = addLearner({
      ...learnerData,
      userId: user.id,
    });
    return { userId: user.id, learnerId };
  };

  const assignInstructor = (learnerId, instructorId) => {
    const instructor = instructors.find(i => i.id === instructorId);
    updateLearner(learnerId, { 
      assignedInstructor: instructorId,
      instructorName: instructor?.name || 'Unknown'
    });
  };

  const addVehicle = (data) => {
    const id = `V${String(vehicles.length + 1).padStart(3, '0')}`;
    setVehicles(prev => [...prev, { id, ...data }]);
  };

  const deleteVehicle = (id) => setVehicles(prev => prev.filter(v => v.id !== id));

  const updateVehicle = (id, data) => setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));

  const getLearnerLessons = (learnerId) => lessons.filter(ls => ls.learnerId === learnerId);
  const getInstructorLearners = (instructorId) => learners.filter(l => l.assignedInstructor === instructorId);

  return (
    <AppContext.Provider value={{
      learners, lessons, instructors, vehicles, users,
      addLearner, updateLearner, deleteLearner, assignInstructor, addLearnerWithAccount,
      addLesson, updateLesson, deleteLesson,
      addVehicle, deleteVehicle, updateVehicle,
      addInstructor, deleteInstructor, updateInstructor,
      getLearnerLessons, getInstructorLearners
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

