import React from 'react';
import './StatCard.css';

function StatCard({ title, value, icon: Icon, variant = 'primary', trend }) {
  const variantColors = {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0'
  };

  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-body">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <div className={`stat-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="stat-icon" style={{ background: `${variantColors[variant]}15` }}>
          <Icon size={28} color={variantColors[variant]} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;