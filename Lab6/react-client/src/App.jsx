import {Route, Routes, NavLink} from 'react-router-dom'
import './App.css'
import Home from "./components/Home.jsx";
import Artists from "./components/Artists.jsx";
import ArtistsById from "./components/ArtistsById.jsx";
import Albums from "./components/Albums.jsx";
import AlbumsById from "./components/AlbumsById.jsx";
import Companies from "./components/Companies.jsx";
import CompanyById from "./components/CompanyById.jsx";
import Search from "./components/SearchType.jsx";
import SongsById from "./components/SongsById.jsx";

function App() {
    return (
        <div className='App'>
            <header className='App-header'>
                <h1 className='App-title center'>
                    Database for International Music
                </h1>
                <nav className='center'>
                    <NavLink className='navlink' to='/'>
                        Home
                    </NavLink>
                    <NavLink className='navlink' to='/artists'>
                        Artists
                    </NavLink>

                    <NavLink className='navlink' to='/albums'>
                        Albums
                    </NavLink>

                    <NavLink className='navlink' to='/companies'>
                        Record Companies
                    </NavLink>

                    <NavLink className='navlink' to='/search'>
                        Search Database
                    </NavLink>
                </nav>
            </header>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/artists' element={<Artists />} />
                <Route path='/artists/:id' element={<ArtistsById />} />
                <Route path='/albums' element={<Albums />} />
                <Route path='/albums/:id' element={<AlbumsById />} />
                <Route path='/companies' element={<Companies />} />
                <Route path='/companies/:id' element={<CompanyById />} />
                <Route path='/search' element={<Search />} />
                <Route path='/songs/:id' element={<SongsById />} />
                <Route path='/search' element={<Search />} />
            </Routes>
        </div>
    )
}

export default App
