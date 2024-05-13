import {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect Fired');
    setUser({name: 'Patrick Hill', username: 'Graffixnyc'});
    setLoading(false);
  }, []);

  if (loading) return <div>loading.....</div>;
  return (
    <>
      <h1>{user.name}</h1>
      <h2>{user.username}</h2>
    </>
  );
}

export default App;
