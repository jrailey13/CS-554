import React from 'react';
import './App.scss';
import {NavLink, Route, Routes} from 'react-router-dom';
import Home from './Home';
import Employees from './Employees';
import Employers from './Employers';

function App() {
  return (
    <div>
      <header className='App-header'>
        <h1 className='App-title center'>
          GraphQL With Apollo Client/Server Demo
        </h1>
        <nav className='center'>
          <NavLink className='navlink' to='/'>
            Home
          </NavLink>
          <NavLink className='navlink' to='/employees'>
            Employees
          </NavLink>

          <NavLink className='navlink' to='/employers'>
            Employers
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/employees/' element={<Employees />} />
        <Route path='/employers/' element={<Employers />} />
      </Routes>
    </div>
  );
}

export default App;
