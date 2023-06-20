import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

const BottomNavbar = () => {

  return (
    <div className='BottomNavbarContainer flex justify-around items-end'>
      <Link >Contact Us</Link>
      <Link >About</Link>
      <Link>Terms and Conditions</Link>
      <Link>Logout</Link>
    </div>
  )
}

export default BottomNavbar;