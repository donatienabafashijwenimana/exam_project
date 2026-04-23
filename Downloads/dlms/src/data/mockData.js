// ─── USERS (3 roles) ─────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 1, name: 'Admin Officer', email: 'admin@dlms.rw', password: 'admin123',
    role: 'admin', avatar: 'AO', badge: 'Police Officer #001',
    permissions: ['all'],
  },
  {
    id: 2, name: 'Instructor Jean', email: 'instructor@dlms.rw', password: 'inst123',
    role: 'instructor', avatar: 'IJ', badge: 'Examiner #E042',
    permissions: ['view_assigned_learners', 'update_progress', 'manage_availability'],
  },
  {
    id: 3, name: 'Learner Alice', email: 'learner@dlms.rw', password: 'learn123',
    role: 'learner', avatar: 'LA', badge: 'Student',
    permissions: ['register', 'view_progress', 'view_schedule'],
    nationalId: '1199880012345678',
  },
  // Additional learners
  {
    id: 4, name: 'Learner Eric', email: 'eric@dlms.rw', password: 'eric123',
    role: 'learner', avatar: 'EN', badge: 'Student',
    permissions: ['register', 'view_progress', 'view_schedule'],
    nationalId: '1199500087654321',
  },
  {
    id: 5, name: 'Instructor Marie', email: 'marie@dlms.rw', password: 'marie123',
    role: 'instructor', avatar: 'IM', badge: 'Examiner #E043',
    permissions: ['view_assigned_learners', 'view_schedule', 'update_progress', 'manage_availability'],
  },
];

// ─── LEARNERS (repurposed from applications) ──────────────────────────────────
export const INITIAL_LEARNERS = [
  {
    id: 'L001', name: 'Alice Uwera', nationalId: '1199880012345678',
    email: 'alice@email.rw', phone: '0788100001', category: 'B',
    photo: 'photo_preview',
    hoursCompleted: 12, totalHours: 30, performance: 85,
    assignedInstructor: 2, instructorName: 'Instructor Jean',
  },
  {
    id: 'L002', name: 'Eric Nkusi', nationalId: '1199500087654321',
    email: 'eric.nkusi@gmail.com', phone: '0722200002', category: 'A',
    photo: 'photo_preview',
    hoursCompleted: 5, totalHours: 20, performance: 70,
    assignedInstructor: null,
  },
  {
    id: 'L003', name: 'Marie Mukamana', nationalId: '1200200056781234',
    email: 'marie.m@yahoo.com', phone: '0733300003', category: 'B',
    photo: 'photo_preview',
    hoursCompleted: 18, totalHours: 30, performance: 78,
    assignedInstructor: 2,
  },
];

// ─── LESSONS/SCHEDULE ─────────────────────────────────────────────────────────
export const INITIAL_LESSONS = [
  {
    id: 'LESS001', learnerId: 'L001', instructorId: 2,
    date: '2026-04-28', time: '10:00', duration: 2,
    category: 'B', location: 'Kigali Central',
    status: 'scheduled', notes: 'Parallel parking practice',
  },
  {
    id: 'LESS002', learnerId: 'L002', instructorId: null,
    date: '2026-05-10', time: '14:00', duration: 2,
    category: 'A', location: 'Remera',
    status: 'pending',
  },
];

// ─── VEHICLES ────────────────────────────────────────────────────────────────
export const INITIAL_VEHICLES = [
  { id: 'V001', plateNumber: 'RAA 123 A', model: 'Toyota Corolla', category: 'B', status: 'Available' },
  { id: 'V002', plateNumber: 'RAB 456 B', model: 'Honda CB500', category: 'A', status: 'Maintenance' },
  { id: 'V003', plateNumber: 'RAC 789 C', model: 'Mercedes Actros', category: 'CE', status: 'Available' },
  { id: 'V004', plateNumber: 'RAD 012 D', model: 'Isuzu Bus', category: 'D', status: 'Available' },
];

// ─── CATEGORIES & LOCATIONS ────────────────────────────────────────────────────
export const LESSON_CATEGORIES = ['A', 'B', 'C', 'D', 'CE'];
export const LOCATIONS = ['Kigali Central', 'Remera', 'Nyabugogo', 'Butare', 'Musanze'];

// ─── CHART DATA (updated for lessons) ─────────────────────────────────────────
export const MONTHLY_LESSONS = [
  { month: 'Oct', lessons: 28, completed: 18 },
  { month: 'Nov', lessons: 35, completed: 22 },
  { month: 'Dec', lessons: 30, completed: 19 },
];

export const INSTRUCTOR_WORKLOAD = [
  { instructor: 'Jean', hours: 45 },
  { instructor: 'Marie', hours: 32 },
];
