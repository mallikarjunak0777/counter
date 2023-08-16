import React, { useState } from 'react';
import './Collapsible.css'; // Import your CSS for styling

const Collapsible = ({ title, content }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(prevCollapsed => !prevCollapsed);
  };
  const filteredData = errorData.filter(item => item.inerror !== "" || item.sserror !== "");

  if (filteredData.length === 0) {
    return <p>No errors to display</p>;
  }

  return (
    <ul>
      {filteredData.map((item, index) => (
        <li key={index}>
          {item.inerror !== "" && <p>inerror: {item.inerror}</p>}
          {item.sserror !== "" && <p>sserror: {item.sserror}</p>}
          <p>inid: {item.inid}</p>
          <p>ssid: {item.ssid}</p>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const errorData = [
    { inerror: "ind1", sserror: "ss12", inid: "2343", ssid: "9879" },
    { inerror: "ind2", sserror: "", inid: "2343", ssid: "9879" },
    { inerror: "", sserror: "ss15", inid: "2343", ssid: "9879" },
    { inerror: "", sserror: "", inid: "2343", ssid: "9879" },
  ];

  return (
    <div>
      <h1>Error List</h1>
      <ErrorListComponent errorData={errorData} />
    </div>
  );
};

export default App;
In this code, the ErrorListComponent filters out objects where both inerror and sserror are empty strings. It then displays the filtered data in a list format.






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
