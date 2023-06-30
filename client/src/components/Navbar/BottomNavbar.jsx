import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoggedInContext } from '../../App'

const BottomNavbar = () => {
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
  const nav = useNavigate()

  const onLogout = () => {
    setLoggedIn({
      id: 0,
      name: '',
      admin: false,
      isLoggedIn: false,
      BOP: ''
    })
    nav('/')
  }

  return (
    <div className='BottomNavbarContainer fixed inset-x-0 bottom-0 flex justify-around items-center py-2 bg-gray-700/25 text-white space-x-4'>
      <p>Airman's Warehouse !© 2023</p>
      <Link to="/about" className="hover:text-[#5DD3CB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]">Contact Us</Link>
      <Link to="/about" className="hover:text-[#5DD3CB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]">About</Link>
      <Link to="/terms" className="hover:text-[#5DD3CB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]">Terms and Conditions</Link>
      <p onClick={onLogout} className="cursor-pointer hover:text-[#5DD3CB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]">Logout</p>
    </div>
);

}

export default BottomNavbar;