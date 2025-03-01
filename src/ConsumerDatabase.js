// ConsumerDatabase.js
import React from 'react';
import './consumer-database.css';

function ConsumerDatabase() {
  // ... your component logic here ...
  return (
    <div className="container">
      {/* ... your JSX here ... */}
    </div>
  );
}

export default ConsumerDatabase;


// consumer-database.css
.container {
  width: 100%;
  maxWidth: '580px';
  height: 'auto';
  minHeight: '380px';
  maxHeight: 'none';
  backgroundColor: 'rgba(0, 0, 0, 0.5)';
  borderRadius: '12px';
  border: '2px solid rgba(255, 187, 0, 0.3)';
}

.container .tags { /* Assumed class name for tag container */
  display: 'flex';
  flexWrap: 'wrap';
  gap: '8px';
  overflow: 'visible';
  alignContent: 'flex-start';
  justifyContent: 'flex-start';
  padding: '8px 12px';
  width: '100%';
  height: 'auto';
}