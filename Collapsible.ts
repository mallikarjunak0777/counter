import React, { useState } from 'react';
import './Collapsible.css'; // Import your CSS for styling

const Collapsible = ({ title, content }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(prevCollapsed => !prevCollapsed);
  };

  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={toggleCollapsed}>
        {title}
        <span className={`arrow-icon ${collapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </div>
      {!collapsed && <div className="collapsible-content">{content}</div>}
    </div>
  );
};

export default Collapsible;
