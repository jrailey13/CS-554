import React from 'react';
import './App.css';

function ChildChild({theme}) {
  return (
    <div className='App'>
      <p style={theme}>I'm the Child's Child here</p>
    </div>
  );
}
export default ChildChild;
