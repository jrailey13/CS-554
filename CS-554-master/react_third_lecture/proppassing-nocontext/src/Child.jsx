import React from 'react';
import './App.css';
import ChildChild from './ChildChild';
function Child({theme}) {
  return (
    <div className='App'>
      <p style={theme}>I'm the Child</p>
      <ChildChild theme={theme} />
    </div>
  );
}
export default Child;
