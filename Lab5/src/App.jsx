import './App.css'
import {Route, Routes} from 'react-router-dom';
import Home from "./components/Home.jsx";
import LaunchPages from "./components/LaunchPages.jsx";
import LaunchById from "./components/LaunchById.jsx";
import PayloadPages from "./components/PayloadPages.jsx";
import PayloadById from "./components/PayloadById.jsx";
import CoresPages from "./components/CoresPages.jsx";
import CoresById from "./components/CoresById.jsx";
import RocketsPages from "./components/RocketsPages.jsx";
import RocketsById from "./components/RocketsById.jsx";
import ShipsPages from "./components/ShipsPages.jsx";
import ShipsById from "./components/ShipsById.jsx";
import LaunchPadPages from "./components/LaunchPadPages.jsx";
import LaunchPadById from "./components/LaunchPadById.jsx";
import Error from "./components/Error.jsx";
import SearchLaunches from "./components/SearchLaunches.jsx";
import SearchPayloads from "./components/SearchPayloads.jsx";
import SearchCores from "./components/SearchCores.jsx";

function App() {
  return (
      <div className='App'>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/launches/page/:page' element={<LaunchPages />} />
              <Route path='/launches/:id' element={<LaunchById />} />
              <Route path='/payloads/page/:page' element={<PayloadPages />} />
              <Route path='/payloads/:id' element={<PayloadById />} />
              <Route path='/cores/page/:page' element={<CoresPages />} />
              <Route path='/cores/:id' element={<CoresById />} />
              <Route path='/rockets/page/:page' element={<RocketsPages />} />
              <Route path='/rockets/:id' element={<RocketsById />} />
              <Route path='/ships/page/:page' element={<ShipsPages />} />
              <Route path='/ships/:id' element={<ShipsById />} />
              <Route path='/launchpads/page/:page' element={<LaunchPadPages />} />
              <Route path='/launchpads/:id' element={<LaunchPadById />} />
              <Route path='/error' element={<Error />} />
              <Route path='/launches/search/:searchTerm' element={<SearchLaunches />} />
              <Route path='/payloads/search/:searchTerm' element={<SearchPayloads />} />
              <Route path='/cores/search/:searchTerm' element={<SearchCores />} />
          </Routes>
      </div>
  )
}

export default App
