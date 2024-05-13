import NoMemo from './NoMemo';
import Memo from './Memo';
import './App.css';

function App() {
  return (
    <div className='App'>
      <NoMemo />
      <Memo />
      <cite>Code Example from Geeks for Geeks</cite>
      <cite>https://www.geeksforgeeks.org/react-js-usememo-hook/</cite>
    </div>
  );
}

export default App;
