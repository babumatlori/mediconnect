
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const WS_NOTIFICATION_URL = import.meta.env.VITE_NOTIFICATION_WS_URL || 'http://localhost:8084';

export const WS_AI_URL = import.meta.env.VITE_AI_WS_URL || 'http://localhost:8085';

// User roles - match exactly what backend sends in jwt

export const ROLES = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    ADMIN: 'ADMIN',
}

// Appointment Statusses - match backend enum

export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLEDTED',
}

// Urgency levels from AI service

export const URGENCY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
}

// Medical specializations - match backend enum exactly
export const SPECIALIZATIONS = [
    { value: 'GENERAL_PHYSICIAN', label: 'General Physician' },
    { value: 'CARDIOLOGIST', label: 'Cardiologist' },
    { value: 'DERMATOLOGIST',      label: 'Dermatologist' },
  { value: 'NEUROLOGIST',        label: 'Neurologist' },
  { value: 'ORTHOPEDIST',        label: 'Orthopedist' },
  { value: 'PEDIATRICIAN',       label: 'Pediatrician' },
  { value: 'PSYCHIATRIST',       label: 'Psychiatrist' },
  { value: 'GYNECOLOGIST',       label: 'Gynecologist' },
  { value: 'OPHTHALMOLOGIST',    label: 'Ophthalmologist' },
  { value: 'ENT_SPECIALIST',     label: 'ENT Specialist' },
  { value: 'DENTIST',            label: 'Dentist' },
  { value: 'RADIOLOGIST',        label: 'Radiologist' },
  { value: 'ONCOLOGIST',         label: 'Oncologist' },
  { value: 'UROLOGIST',          label: 'Urologist' },
  { value: 'ENDOCRINOLOGIST',    label: 'Endocrinologist' },
];

// Sidebar navigation config - role based links
export const NAV_LINKS = {
    PATIENT: [
        {path: '/patient/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/patient/book',         label: 'Book Appointment',  icon: 'CalendarPlus' },
        { path: '/patient/appointments', label: 'My Appointments',   icon: 'Calendar' },
        { path: '/patient/ai/symptoms',  label: 'Symptom Check',     icon: 'Stethoscope' },
        { path: '/patient/ai/reports',   label: 'Report Summary',    icon: 'FileText' },
        { path: '/patient/profile',      label: 'My Profile',        icon: 'User' },
        { path: '/patient/notifications',label: 'Notifications',     icon: 'Bell' },
    ],
    DOCTOR: [
        {path: '/doctor/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/doctor/appointments', label: 'My Appointments',   icon: 'Calendar' },
        { path: '/doctor/availability', label: 'My Availability',   icon: 'Clock' },
        { path: '/doctor/profile',      label: 'My Profile',        icon: 'User' },
    ],
    ADMIN: [
        {path: '/admin/dashboard', label: 'Overview', icon: 'BarChart2' },
        { path: '/admin/users',     label: 'Manage Users',    icon: 'Users' },
    ],
};
