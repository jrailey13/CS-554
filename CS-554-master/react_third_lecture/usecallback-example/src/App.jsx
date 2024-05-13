import './App.css';
import Callback from './Callback';
import NoCallback from './NoCallback';

function App() {
  return (
    <div className='App'>
      Not using useCallback
      <NoCallback />
      Using useCallback
      <Callback />
    </div>
  );
}

export default App;
