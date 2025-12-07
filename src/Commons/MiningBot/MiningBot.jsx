import React from 'react';
import './MiningBot.css';

const MiningBot = () => {
  return (
    <div className="container">
      <div className="loader">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bar"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default MiningBot;
