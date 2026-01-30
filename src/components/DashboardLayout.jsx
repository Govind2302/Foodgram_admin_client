import React from 'react';
import Sidebar from './Sidebar.jsx';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;