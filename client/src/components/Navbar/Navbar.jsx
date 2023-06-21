import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {
  AiOutlineShoppingCart,
  AiOutlineHome,
  AiOutlineShop,
  AiOutlineQuestionCircle,
  AiOutlineLogin
} from 'react-icons/ai';
import { TbLocation } from "react-icons/tb";
import { LoggedInContext } from '../../App'

const Navbar = () => {
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
  const nav = useNavigate();
  const [itemsInCart, setItemsInCart] = useState([]);
  const [savedCart, setSavedCart] = useState([]);

  useEffect(() => {

    setItemsInCart(savedCart)

    const interval = setInterval(() => {
      var currentCart = [];
      if (localStorage.getItem('itemCart') && localStorage.getItem('patchCart')) {
        currentCart = JSON.parse(localStorage.getItem('itemCart')).concat(JSON.parse(localStorage.getItem('patchCart')));
      } else if (localStorage.getItem('itemCart') && !localStorage.getItem('patchCart')) {
        currentCart = JSON.parse(localStorage.getItem('itemCart'));
      } else if (localStorage.getItem('patchCart') && !localStorage.getItem('itemCart')) {
        currentCart = JSON.parse(localStorage.getItem('patchCart'));
      } else {
        currentCart = [];
      }
      if (JSON.stringify(currentCart) !== JSON.stringify(savedCart)) {
        setSavedCart(currentCart);
        setItemsInCart(currentCart);
      }
    }, 500);

    return () => clearInterval(interval)

  }, [savedCart])



  const onLogout = () => {
    setLoggedIn({
      id: 0,
      name: '',
      admin: false,
      isLoggedIn: false,
      BOP: ''
    })
    console.log('h1')
    nav('/')
  }

  return (
    <div className="NavbarContainer flex justify-between items-center bg-neutral-700/25 p-4">
      <div className="NavbarImageContainer flex items-center">
        <img
          className="NavbarImage w-12 h-12"
          src="../../assets/logo.jpg"
          alt="Airman's Attic Logo"
        />
      </div>
      <div className="NavbarLinksContainer flex gap-3">
        <Link
          className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
          to="/"
        >
          <div className="flex items-center justify-center">
            <AiOutlineHome className="mr-1" /> Home
          </div>
        </Link>
        <Link
          className="NavbarLinks justify-center rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
          to="/shop"
        >
          <div className="flex items-center justify-center">
            <AiOutlineShop className="mr-1" /> Shop
          </div>
        </Link>
        <Link
          className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
          to="/location"
        >
          <div className="flex items-center justify-center">
            <TbLocation className="mr-1" /> Location
          </div>
        </Link>
        <Link
          className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
          to="/patches"
        >
          <div className="flex items-center justify-center">
            <img
              className="w-4 h-4 mr-1"
              src="https://cdn-icons-png.flaticon.com/128/2047/2047136.png"
              alt="Patches"
            />
            Patches
          </div>
        </Link>
        <Link
          className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
          to="/about"
        >
          <div className="flex items-center justify-center">
            <AiOutlineQuestionCircle className="mr-1" /> About
          </div>
        </Link>
        {loggedIn.isLoggedIn ? (
          <>

            <Link
              className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
              to="/login"
            >
              <div className="flex items-center justify-center" onClick={onLogout}>
                <AiOutlineLogin className="mr-1" /> Logout
              </div>
            </Link>
            <Link
              className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
              to="/cart"
            >
              <div className="flex items-center justify-center">
                <AiOutlineShoppingCart className="mr-1" />Cart <span className="badge badge-info">{itemsInCart ? (<p>({itemsInCart.length})</p>) : null}</span>
                <span class="sr-only">amount of cart items</span>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link
              className="NavbarLinks rounded border-solid bg-[#C5C6C7] text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] px-2 py-1"
              to="/login"
            >
              <div className="flex items-center justify-center">
                <AiOutlineLogin className="mr-1" /> Login
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
