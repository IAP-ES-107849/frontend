import React from 'react';
import ReactDOM from 'react-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple homepage component.</p>
    </div>
  );
};

ReactDOM.render(<HomePage />, document.getElementById('root'));