import './App.css';
import Todos from './components/Todos';
import Users from './components/Users';
import All from './components/All';
function App() {
  return (
    <div className='App'>
      <div>
        <h1> Todo Tracker</h1>
        <Todos />
      </div>
      <hr />
      <div>
        <h1>Users</h1>
        <Users />
      </div>
      <div>
        <h1>ALL</h1>
        <All />
      </div>
    </div>
  );
}

export default App;
