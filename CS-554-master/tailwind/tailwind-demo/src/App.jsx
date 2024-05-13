import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Character from "./pages/Character";

function App() {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/:characterId" Component={Character} />
    </Routes>
  );
}

export default App;
