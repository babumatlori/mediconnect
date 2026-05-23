import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
// import { cn } from '../../utils/cn';

/**
 * DashboardLayout — wraps all authenticated pages.
 *
 * Structure:
 * ┌──────────────────────────────────────┐
 * │ Sidebar (fixed left, w-60)           │
 * │ ┌────────────────────────────────┐   │
 * │ │ TopNavbar (h-16)               │   │
 * │ ├────────────────────────────────┤   │
 * │ │ Page Content (scrollable)      │   │
 * │ │   <Outlet /> renders here      │   │
 * │ └────────────────────────────────┘   │
 * └──────────────────────────────────────┘
 *
 * WHY h-screen overflow-hidden on outer div:
 * Makes the layout fill exactly the viewport height.
 * overflow-hidden prevents double scrollbars.
 * Only the main content area scrolls, not the whole page.
 *
 * WHY lg:ml-60:
 * On desktop, sidebar takes 240px (w-60).
 * Content area needs left margin equal to sidebar width.
 * On mobile (< lg), sidebar overlays content so no margin needed.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-50">

      {/* ── Sidebar ──────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/*
        Mobile overlay — dark backdrop behind sidebar.
        Clicking it closes the sidebar.
        Only visible on mobile when sidebar is open.
      */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main Content Area ─────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-60">

        {/* Top Navbar */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/*
          Page content.
          flex-1: takes remaining height after navbar.
          overflow-y-auto: this area scrolls, not the whole page.
          Padding adjusts for screen size.
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

          {/*
            <Outlet /> renders the current child route.
            When user is at /patient/dashboard,
            PatientDashboard renders here.
            When at /patient/appointments,
            MyAppointments renders here.
            Sidebar and Navbar stay the same.
          */}
          <Outlet />

        </main>

         {/* Footer */}
    <footer className="border-t bg-white px-6 py-4 text-center text-sm text-secondary-500">
      © 2026 MediConnect. All rights reserved.
    </footer>
      </div>

    </div>
  );
}
