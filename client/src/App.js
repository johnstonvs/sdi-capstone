import React, { useContext, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Shop, Locations, Patches, About, LoginPage } from './pages/index.js';
import { Navbar } from './components/index.js';

const LoggedInContext = createContext()

function App() {
  const [loggedIn, setLoggedIn] = useState({
    name:'',
    admin: false
  })

  return (
    <Router>
      <Navbar />
      <LoggedInContext.Provider value={ { loggedIn, setLoggedIn } } >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/locations' element={<Locations />} />
        <Route path='/patches' element={<Patches />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </ LoggedInContext.Provider >
    </Router>
  );
}

export default App;
