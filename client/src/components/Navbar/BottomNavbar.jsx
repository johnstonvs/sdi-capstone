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
    console.log('h1')
    nav('/')
  }

  return (
    <div className='BottomNavbarContainer fixed inset-x-0 bottom-0 flex justify-around items-end bg-neutral-700/25 text-white'>
      <p>Airman's Warehouse !© 2023</p>
      <Link to="/about#ContactUsForm" className="hover:text-[#5DD3CB] transition-colors duration-200">Contact Us</Link>
      <Link to="/about" className="hover:text-[#5DD3CB] transition-colors duration-200">About</Link>
      <Link to="/terms" className="hover:text-[#5DD3CB] transition-colors duration-200">Terms and Conditions</Link>
      <p onClick={onLogout} className="cursor-pointer hover:text-[#5DD3CB] transition-colors duration-200">Logout</p>
    </div>
  )
}

export default BottomNavbar;