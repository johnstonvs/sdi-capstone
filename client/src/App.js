import React, { useContext, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Shop, Locations, Patches, About, LoginPage, Cart, Profile, Item, Patch } from './pages/index.js';
import { Navbar, BottomNavbar } from './components/index.js';


export const LoggedInContext = createContext()

function App() {

  const defaultLogin = {
    id: 0,
    name:'',
    admin: false,
    isLoggedIn:false,
    BOP:''
  };

  const [loggedIn, setLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultLogin;
  })

  return (
    <Router className='RoutesContainer flex h-full w-full'>
      <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }} >
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/shop/item/:id' element={<Item />} />
          <Route path='/shop/patch/:id' element={<Patch />} />
          <Route path='/location' element={<Locations />} />
          <Route path='/patches' element={<Patches />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Routes>
        <BottomNavbar className='BottomNavbar flex self-end'/>
      </LoggedInContext.Provider >
    </Router>
  );
}

export default App;
