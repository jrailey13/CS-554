import {useState} from 'react';
import TrackRenders from './components/TrackRenders';
import DomElements from './components/DomElements';
import TrackStateChanges from './components/TrackStateChanges';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Track Renders</h1>
      <TrackRenders />
      <hr />
      <h1>Reference DOM Elements</h1>
      <DomElements />
      <hr />
      <h1>Track State Changes</h1>
      <TrackStateChanges />
    </>
  );
}

export default App;
