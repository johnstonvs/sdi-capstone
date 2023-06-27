import React, { useContext, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Shop, Locations, Patches, About, LoginPage, Cart, Checkout, Profile, Item, Patch, AdminItems, Orders} from './pages/index.js';
import { Navbar, BottomNavbar } from './components/index.js';

export const TagsContext = createContext();
export const LoggedInContext = createContext();

function App() {

  const defaultLogin = {
    id: 0,
    name:'',
    admin: false,
    isLoggedIn: false,
    BOP:''
  };

  const [tags] = useState(['OCP', 'Blues', 'Boots', 'Shoes', 'Outdated', 'Hobby', 'Electronics', 'Furniture', 'Baby', 'Toddler', 'Teen', 'Adult', 'Toys', 'Sports', 'Outdoor', 'Workout', 'Housewares', 'Books'])
  const [loggedIn, setLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultLogin;
  })

  return (
      <Router>
        <TagsContext.Provider value={{tags}}>
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }} >
          <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/shop/item/:id' element={<Item />} />
              <Route path='/patches/patch/:id' element={<Patch />} />
              <Route path='/location' element={<Locations />} />
              <Route path='/patches' element={<Patches />} />
              <Route path='/about' element={<About />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/cart/checkout' element={<Checkout />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route path='/profile/:id/adminitems' element={<AdminItems />} />
              <Route path='/profile/:id/orders' element={<Orders />} />
            </Routes>
          <BottomNavbar className='BottomNavbar'/>
        </LoggedInContext.Provider >
        </ TagsContext.Provider >
      </Router>
  );
}

export default App;
