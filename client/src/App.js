import React, { useContext, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Shop, Locations, Patches, About, LoginPage, Cart, Profile } from './pages/index.js';
import { Navbar } from './components/index.js';

export const LoggedInContext = createContext()

function App() {
  const [loggedIn, setLoggedIn] = useState({
    id: 0,
    name:'',
    admin: false,
    isLoggedIn:false,
    BOP:''
  })

  return (
    <Router>
      <LoggedInContext.Provider value={ { loggedIn, setLoggedIn } } >
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/locations' element={<Locations />} />
        <Route path='/patches' element={<Patches />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile/:id' element={<Profile/>} />
      </Routes>
    </ LoggedInContext.Provider >
    </Router>
  );
}

export default App;
